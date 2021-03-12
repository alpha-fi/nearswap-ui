import React, { useEffect, useState, useContext } from "react";
import { Button } from 'react-bootstrap'

import { browsePools, poolInfo, sharesBalance, calcPerToken, calcPerNear } from "../services/near-nep21-util";

import PoolInfoCard from "./PoolInfoCard"
import AddLiquidityModal from "./AddLiquidityModal"
import CreatePoolModal from "./CreatePoolModal";

import { TokenListContext } from "../contexts/TokenListContext";
import { InputsContext } from "../contexts/InputsContext";

export default function PoolTab() {

  const inputs = useContext(InputsContext);

  const [pools, setPools] = useState([]);

  // Token list state
  const tokenListState = useContext(TokenListContext);

  async function fetchPools() {
    const pools = await browsePools();
      for (let tokenAddress of pools) {
        const pi = await poolInfo(tokenAddress);
        // Set state to an array of pools and include the name of the pool
        // @TODO: find token within TokenListContext and include images, etc.
        
        // Find token symbol
        let tokenSymbol;
        let tokenDecimals;
        for (let i = 0; i < tokenListState.state.tokens.length; i++) {
          if (tokenListState.state.tokens[i].address === tokenAddress) {
            tokenSymbol = tokenListState.state.tokens[i].symbol;
            tokenDecimals = tokenListState.state.tokens[i].decimals;
            break;
          }
        }

        // Find token per NEAR and vice versa
        let perToken = await calcPerToken(tokenAddress);
        let perNear = await calcPerNear(tokenAddress);

        // Find personal shares of pool
        let myShares = await sharesBalance(tokenAddress);

        setPools(pools => [...pools, {...pi,
          name: tokenAddress,
          symbol: tokenSymbol,
          my_shares: myShares,
          near_per_token: perToken,
          token_per_near: perNear,
          decimals: tokenDecimals
        }]);
    }
  }

  async function handlePoolCreation(tokenAddress, initialToken, initialNear) {
    if(window.accountId == "") {
      alert('Please connect to NEAR wallet first!!');
      return;
    }
    // Update data
    inputs.dispatch({ type: 'TOGGLE_CREATE_POOL_MODAL' });
  }


  //----------------------------
  //----------------------------
  //----------------------------
  useEffect(function() {
     fetchPools();
   }, []);

  return (
    <>
      <p className="text-center my-1 text-secondary" style={{ 'letterSpacing': '3px' }}><small>POOLS</small></p>
      <Button variant="warning" size="md" className="ml-1 mb-1" onClick={() => handlePoolCreation("", "", "")}>Add New Pool</Button>{' '}
      {pools.map((pool, index) => (
        <PoolInfoCard key={index} 
                    ynear={pool.ynear} 
                    reserve={pool.reserve} 
                    total_shares={pool.total_shares} 
                    name={pool.name}
                    symbol={pool.symbol}
                    my_shares={pool.my_shares}
                    near_per_token={pool.near_per_token}
                    token_per_near={pool.token_per_near}
                    decimals={pool.decimals}
                    />
      ))}
      <AddLiquidityModal/>
      <CreatePoolModal/>
    </>
  );
}
