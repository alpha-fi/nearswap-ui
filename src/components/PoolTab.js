import React, { useEffect, useState, useContext } from "react";

import { convertToE24Base, browsePools, poolInfo, sharesBalance } from "../services/near-nep21-util";

import PoolInfoCard from "./PoolInfoCard"
import AddLiquidityModal from "./AddLiquidityModal"

import { TokenListContext } from "../contexts/TokenListContext";

import Button from 'react-bootstrap/Button';

import { BsPlus } from "react-icons/bs";

export default function PoolTab() {

  const [pools, setPools] = useState([]);

  // Token list state
  const tokenListState = useContext(TokenListContext);

  async function fetchPools() {
    browsePools()
    .then(function(fetchedPools) {
      fetchedPools.map((fetchedPoolInfo, index) => {
        poolInfo(fetchedPoolInfo)
        .then(async function(poolInfo) {
          // Set state to an array of pools and include the name of the pool
          // @TODO: find token within TokenListContext and include images, etc.

          let tokenAddress = fetchedPools[index];
          
          // Find token symbol
          let tokenSymbol;
          for (let i = 0; i < tokenListState.state.tokens.length; i++) {
            if (tokenListState.state.tokens[i].address === tokenAddress) {
              tokenSymbol = tokenListState.state.tokens[i].symbol;
              break;
            }
          }

          // Find personal shares of pool
          let myShares = await sharesBalance(tokenAddress);

          setPools(pools => [...pools, {...poolInfo, name: tokenAddress, symbol: tokenSymbol, my_shares: myShares }]);
        });
      });
    });
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
      {pools.map((pool, index) => (
        <PoolInfoCard key={index} 
                    ynear={pool.ynear} 
                    reserve={pool.reserve} 
                    total_shares={pool.total_shares} 
                    name={pool.name}
                    symbol={pool.symbol}
                    my_shares={pool.my_shares}
                    />
      ))}
      <AddLiquidityModal/>
    </>
  );
}
