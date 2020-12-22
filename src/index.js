import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { initContract } from './utils'

import { ThemeProvider } from "./contexts/ThemeContext";
import { InputsProvider } from './contexts/InputsContext';
import { Web3Provider } from './contexts/Web3Context';
import { TokenListProvider } from './contexts/TokenListContext';
import { NotificationProvider } from './contexts/NotificationContext';

initToken().then(value => {
  console.log("Finsihed Loading Token List!!");

  window.nearInitPromise = initContract()
  .then(() => {
    console.log("RENDERING:");
    ReactDOM.render(
      <InputsProvider>
        <Web3Provider>
          <TokenListProvider>
            <NotificationProvider>
              <ThemeProvider>
                <App />
              </ThemeProvider>
            </NotificationProvider>
          </TokenListProvider>
        </Web3Provider>
      </InputsProvider>,
      document.querySelector('#root')
    )
  })
  .catch(console.error)
});

async function fetchJson(src) {
  const response = await fetch(src);
  return await response.json();
}

async function initToken() {
  switch(window.config.nearNetworkId) {
  case 'betanet':
    var tokens = await fetchJson("https://ghcdn.rawgit.org/near-clp/token-list/master/beta-net.json")
    window.tokens = tokens
    break;
  case 'guildnet':
    var tokens = await fetchJson("https://ghcdn.rawgit.org/near-clp/token-list/master/guild-net.json")
    window.tokens = tokens
    break;
  case 'mainnet':
    var tokens = await fetchJson("https://ghcdn.rawgit.org/near-clp/token-list/master/main-net.json")
    window.tokens = tokens
    break;
  case 'testnet':
    var tokens = await fetchJson("https://ghcdn.rawgit.org/near-clp/token-list/master/test-net.json")
    window.tokens = tokens
    break;
  default:
    break;
  }
  console.log("Loaded Token List: ", window.tokens);
}

