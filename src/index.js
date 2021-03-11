import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { initContract } from './utils'

import { ThemeProvider } from "./contexts/ThemeContext";
import { InputsProvider } from './contexts/InputsContext';
//import { Web3Provider } from './contexts/Web3Context';
import { TokenListProvider } from './contexts/TokenListContext';
import { NotificationProvider } from './contexts/NotificationContext';


const tokenListURLs = {
  'betanet': 'https://ghcdn.rawgit.org/near-clp/token-list/master/beta-net.json',
  'guildnet': 'https://ghcdn.rawgit.org/near-clp/token-list/master/guild-net.json',
  'mainnet': 'https://ghcdn.rawgit.org/near-clp/token-list/master/main-net.json',
  'testnet': 'https://ghcdn.rawgit.org/near-clp/token-list/master/test-net.json'
}

async function loadTokenList() {
  const url = tokenListURLs[window.config.nearNetworkId];
  if (url === undefined) {
    console.error("Unknown network '%s', can't fetch token list", window.config.nearNetworkId);
    return
  }
  const response = await fetch(url);
  window.tokens = await response.json();
  console.log("Loaded Token List: ", window.tokens);
}


loadTokenList().then(() => {
  window.nearInitPromise = initContract()
    .then(() => {
      ReactDOM.render(
        <InputsProvider>
            <TokenListProvider>
              <NotificationProvider>
                <ThemeProvider>
                  <App />
                </ThemeProvider>
              </NotificationProvider>
            </TokenListProvider>
        </InputsProvider>,
        document.querySelector('#root')
      )
    })
    .catch(console.error)
});
