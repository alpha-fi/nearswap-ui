import { Contract } from 'near-api-js'

const e22 = '0'.repeat(22);
const maxGas = '300000000000000';
const attach60NearCents = '6' + e22;
const nep21AllowanceFee = '4' + e22;
const NDENOM = 1e24;
const nativeToken = "NATIVE TOKEN";
const nep21 = "NEP-21";

export async function getBalanceNEP(contractName) {

  window.nep21 = await new Contract(
    window.walletConnection.account(),
    contractName,
    {
      // View methods are read only
      viewMethods: ['get_balance'],
      // Change methods modify state but don't receive updated data
      changeMethods: []
    }
  )
  return await window.nep21.get_balance({ owner_id: window.walletConnection.getAccountId() });
}

export async function calcSlippage(tokenProvide, tokenWant) {

  const price = await calcPriceFromOut(tokenProvide, tokenWant);
  const token = Object.assign({}, tokenWant);
  token.amount = 1;
  const unitPrice = await calcPriceFromOut(tokenProvide, token);
  const noSlippagePrice = unitPrice * tokenWant.amount;
  const slippage = (price - noSlippagePrice) / noSlippagePrice;
  console.log("Slippage: ", slippage);
  return slippage;

}

export async function incAllowance(swapLeg) {

  if (swapLeg.amount==""||swapLeg.amount=="0".repeat(24)) {
    console.log("ERR:swapLeg.amount==''!!")
    return;
  }
  window.nep21 = await new Contract(
    window.walletConnection.account(),
    swapLeg.address,
    {
      // View methods are read only
      viewMethods: [],
      // Change methods modify state but don't receive updated data
      changeMethods: ['inc_allowance']
    }
  )

  try {
    //WARN: SDE, State Destruction Event, window.nep21.inc_allowance will navigate out of this SPA to the wallet
    await window.nep21.inc_allowance({
      escrow_account_id: window.config.contractName,
      amount: swapLeg.amount+""
    },
      maxGas,
      nep21AllowanceFee
    );
    console.log("DONE");
    return true;
  } 
    catch (error) {
    console.log(error);
    return false;
  }

}

export async function getAllowance(token) {
  const accountId = window.accountId;
  window.nep21 = await new Contract(
    window.walletConnection.account(),
    token.address,
    {
      // View methods are read only
      viewMethods: ['get_allowance'],
      // Change methods modify state but don't receive updated data
      changeMethods: []
    }
  )
  const allowance = await window.nep21.get_allowance({
    owner_id: accountId,
    escrow_account_id: window.config.contractName
  });
  console.log('Allowance: ', allowance);
  return allowance;
}

export async function gasCheck() {
  // Set default
  const near_limit = 0.6;
  const bal = (await window.walletConnection.account().getAccountBalance()).available / NDENOM;
  if (bal > near_limit) {
    return true;
  }
  return false;
}

export function convertToE24Base5Dec(str) {
  let result = convertToE24Base(str)
  return result.slice(0, -19)
}

export function convertToE24Base(str) {
  let result = (str + "").padStart(25, "0")
  result = result.slice(0, -24) + "." + result.slice(-24)
  return result
  /*
    const append = 25 - str.length;
    if(append > 0) {
      str = '0'.repeat(append) + str;
    }
    const pos = str.length - 24;
    var res = [str.slice(0, pos), '.', str.slice(pos)].join('');
    res = trimZeros(res);
  
    if(res[0] === '.')
      res = '0' + res;
  
    if(res[res.length - 1] === '.')
      res = res.slice(0, res.length - 1);
    return res;
    */
}

export function trimZeros(str) {
  if (typeof str !== "string") return str + "";
  let start = 0;
  for (; start < str.length; ++start) {
    if (str[start] !== '0') break;
  }
  let end = str.length - 1;
  for (; end > start; --end) {
    if (str[end] !== '0') break;
  }
  if (str.includes(".") === false) {
    str = str.slice(start, str.length);
    if (str === "")
      return "0";
    return str;
  }
  var res = str.slice(start, end + 1);
  if (res === "" || res === ".")
    return "0";
  return res;
}

/** convert an amount in tokens into YOCTOS
 * normalizeAmount 135  => "135"+"0".repeat(24)
 * normalizeAmount 0.14 => "14"+"0".repeat(24-2)
 */
export function normalizeAmount(value) {
  let ok = false;
  let val = 24;
  let res = "";
  value = (value + "").trim();
  const amount = trimZeros(value);

  for (var x of amount) {
    if (x === '.') {
      ok = true;
    }
    else if (x >= '0' && x <= '9') {
      if (ok)
        val--;
      res += x;
    } else {
      console.error("Error: Wrong Input");
      return -1;
    }
  }
  res = res + "" + '0'.repeat(val);
  return res;
}

//Convert token units to yoctos 
// 1.25 => 1.25*1e24.to_String()
// 42 => 42*1e24.toString() 
// 0 => "0".repeat(24)
// The returned string will have at least 24 zeros
//alias to normalizeAmount
export const toYoctosString = normalizeAmount;
// function toYoctosString(amount){
//   let result = (amount + "").trim()
//   let zerosToAdd=24;
//   let pos = result.indexOf(".");
//   if (pos>=0){
//       zerosToAdd=zerosToAdd-(result.length-pos-1)
//   }
//   result = result.replace(".","") + "0".repeat(zerosToAdd)
//   return result
// }

// Returns 1 if same type of tokens found
function checkTokenType(tokenProvide, tokenWant) {
  if((tokenProvide === nativeToken && tokenProvide.type === tokenWant.type) || 
    (tokenProvide.address === tokenWant.address)) {

    console.log("Cannot Swap Same type of tokens");
    return 1;
  }
  return 0;
}

export async function calcPriceFromIn(tokenProvide, tokenWant) {
  //const amount1 = normalizeAmount( tokenProvide.amount );

  if (tokenProvide.amount < 1 || checkTokenType(tokenProvide, tokenWant)) {
    return 0;
  }

  if (tokenProvide.type === nativeToken) {
    // Native to NEP-21
    const price = await window.contract.price_near_to_token_in({
      token: tokenWant.address,
      ynear_in: toYoctosString(tokenProvide.amount)
    });
    console.log(price);
    return price;
  }
  else {
    if (tokenWant.type === nep21) {
      // NEP-21 to NEP-21
      const price = await window.contract.price_token_to_token_in({
        from: tokenProvide.address,
        to: tokenWant.address,
        tokens_in: toYoctosString(tokenProvide.amount)
      });
      return price;
    }
    else if (tokenWant.type === nativeToken) {
      // NEP-21 to Native
      const price = await window.contract.price_token_to_near_in({
        token: tokenProvide.address,
        tokens_in: toYoctosString(tokenProvide.amount)
      });
      return price;
    }
    else {
      console.log("Error: Token type error");
    }
  }
}

export async function swapFromIn(tokenProvide, tokenWant) {
  const amount1 = normalizeAmount(tokenProvide.amount);
  const amount2 = normalizeAmount(tokenWant.amount);

  if(checkTokenType(tokenProvide, tokenWant)) {
    return 0;
  }

  if (tokenProvide.type === nativeToken) {
    // Native to NEP-21
    await window.contract.swap_near_to_token_exact_in({
      token: tokenWant.address,
      min_tokens: amount2
    },
      maxGas,
      attach60NearCents
    );

  }
  else {
    if (tokenWant.type === nep21) {
      // NEP-21 to NEP-21
      await window.contract.swap_tokens_exact_in({
        from: tokenProvide.address,
        to: tokenWant.address,
        tokens_in: amount1,
        min_tokens_out: amount2
      },
        maxGas,
        attach60NearCents
      );

    }
    else if (tokenWant.type === nativeToken) {
      // NEP-21 to Native
      await window.contract.swap_token_to_near_exact_in({
        token: tokenProvide.address,
        tokens_paid: amount1,
        min_ynear: amount2
      },
        maxGas,
        attach60NearCents
      );

    }
    else {
      console.error("Error: Token type error");
    }
  }
}

export async function calcPriceFromOut(tokenProvide, tokenWant) {
  
  if (tokenWant.amount < 1 || checkTokenType(tokenProvide, tokenWant)) {
    return 0;
  }
  console.log(tokenProvide.type, tokenWant.type);
  if (tokenProvide.type === nativeToken) {
    // Native to NEP-21
    const price = await window.contract.price_near_to_token_out({
      token: tokenWant.address,
      tokens_out: toYoctosString(tokenWant.amount)
    });
    console.log("expect_in ", price);
    return price;
  }
  else {
    if (tokenWant.type === nep21) {
      // NEP-21 to NEP-21
      const price = await window.contract.price_token_to_token_out({
        from: tokenProvide.address,
        to: tokenWant.address,
        tokens_out: toYoctosString(tokenWant.amount)
      });
      console.log("expect_in ", price);
      return price;
    }
    else if (tokenWant.type === nativeToken) {
      // NEP-21 to Native
      const price = await window.contract.price_token_to_near_out({
        token: tokenProvide.address,
        ynear_out: toYoctosString(tokenWant.amount)
      });
      return price;
    }
    else {
      console.log("Error: Token type error");
    }
  }
}

export async function swapFromOut(tokenProvide, tokenWant) {

  if(checkTokenType(tokenProvide, tokenWant)) {
    return 0;
  }
  
  const amountWant = toYoctosString(tokenWant.amount); //user input: I want 2 tokens out from the pool -> convert "2" to yoctos
  const amountProvide = tokenProvide.amount; //computed amount he has to send into the pool, already in yoctos 

  if (tokenProvide.type === nativeToken) {
    // Native to NEP-21
    //NEARs IN / Tokens out
    await window.contract.swap_near_to_token_exact_out({
      token: tokenWant.address,
      tokens_out: amountWant
    },
      maxGas,
      attach60NearCents
    );

  }
  else {
    if (tokenWant.type === nep21) {
      // NEP-21 to NEP-21
      await window.contract.swap_tokens_exact_out({
        from: tokenProvide.address,
        to: tokenWant.address,
        tokens_out: amountWant,
        max_tokens_in: amountProvide
      },
        maxGas,
        attach60NearCents
      );

    }
    else if (tokenWant.type === nativeToken) {
      // NEP-21 to Native
      await window.contract.swap_token_to_near_exact_out({
        token: tokenProvide.address,
        ynear_out: amountWant,
        max_tokens: amountProvide
      },
        maxGas,
        attach60NearCents
      );

    }
    else {
      console.error("Error: Token type error");
    }
  }
}

// returns NEAR amount needed for x amount of tokens while adding liquidity
export async function calcNearAddLiquidity(tokenDetails) {

  const unitPrice = await window.contract.price_near_to_token_out({
    token: tokenDetails.address,
    tokens_out: normalizeAmount("1")
  });

  const nearRequired = tokenDetails.amount * unitPrice;
  return nearRequired;
}

export async function addLiquiduty(tokenDetails, maxTokenAmount, minSharesAmount) {
  await window.contract.add_liquidity({
    token: tokenDetails.address,
    max_tokens: maxTokenAmount,
    min_shares: minSharesAmount
  },
    maxGas,
    attach60NearCents
  );
}

// returns true if pool already exists
export async function createPool(tokenDetails, maxTokenAmount, minSharesAmount) {
  const info = await window.contract.pool_info({ token: tokenDetails.address });

  if (info !== null) {
    // Pool already exists.
    return true;
  }
  await window.contract.create_pool({ token: tokenDetails.address });

  await addLiquiduty(tokenDetails.address, maxTokenAmount, minSharesAmount);

  return false;
}

export async function browsePools() {
  try {
    const pools = await window.contract.list_pools();
    console.log(pools);
    return pools;
  } catch (error) {
    console.error('cannot fetch pool list');
  }
}

export async function poolInfo(pool) {
  try {
    const poolInfo = await window.contract.pool_info({ token: pool });
    console.log(poolInfo);
    return poolInfo;
  } catch (error) {
    console.error('cannot fetch pool info');
  }
}

// eturns the owner balance of shares of a pool identified by token.
export async function sharesBalance(token) {
  const bal = await window.contract.balance_of({
    token: token.address,
    owner: window.walletConnection.account()
  });
  return bal;
}
