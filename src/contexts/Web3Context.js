import React, {createContext, useState, useEffect} from 'react';

import Web3Modal from 'web3modal';
import Web3 from 'web3';
import WalletConnectProvider from '@walletconnect/web3-provider';

const Web3Context = createContext();
const { Provider } = Web3Context;

//https://chainid.network/
const EthNetworks = new Map(); // Map from chainId to Network-Name
EthNetworks.set(1, "Mainnet : Ethereum main network");
EthNetworks.set(3, "Ropsten : Ethereum test network (PoW)");
EthNetworks.set(4, "Rinkeby : Ethereum test network (PoA)");
EthNetworks.set(42, "Kovan : Ethereum test network (PoA)");
EthNetworks.set(61, "Ethereum Classic Mainnet : Ethereum Classic main network");
EthNetworks.set(62, "Morden : Ethereum Classic test network");

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider, // required
    options: {
      infuraId: window.config.infuraId,
    },
  },
};

const w3connect = async (web3Modal) => {
  const provider = await web3Modal.connect();
  const web3 = new Web3(provider);
  const injectedChainId = await web3.eth.getChainId();

  if (injectedChainId !== window.config.ethChainId) {
    alert(
      `Please switch Web3 to the correct network and try signing in again. Detected network: ${
        EthNetworks.get(injectedChainId)
      }, Required network: ${
        EthNetworks.get(window.config.ethChainId)
      }`,
    );
  }

  return { web3Modal, web3, provider };
};

const signInWithWeb3 = async () => {

  const web3Modal = new Web3Modal({
    network: window.config.ethChainId, // optional
    providerOptions, // required
    cacheProvider: true,
  });

  const provider = await web3Modal.connect();
  const web3 = new Web3(provider);
  const injectedChainId = await web3.eth.getChainId();

  if (injectedChainId !== window.config.ethChainId) {
    alert(
      `Please switch Web3 to the correct network and try signing in again. Detected network: ${
        EthNetworks.get(injectedChainId)
      }, Required network: ${
        EthNetworks.get(window.config.ethChainId)
      }`,
    );
  }

  return { web3Modal, web3, provider };
};

const Web3Provider = ( { children } ) => {

  const [currentUser, setCurrentUser] = useState();
  const [web3Modal, setWeb3Modal] = useState(
    new Web3Modal({
      network: window.config.ethChainId, // optional
      providerOptions, // required
      cacheProvider: true,
    }),
  );

  useEffect(() => {
    const initCurrentUser = async () => {
      try {
        const w3c = await w3connect(web3Modal);
        setWeb3Modal(w3c);

        const [account] = await w3c.web3.eth.getAccounts();
        let user = account;
        setCurrentUser(user);
      } catch (e) {
        console.error(`Could not log in with web3`);
      }
    };

    if (web3Modal.cachedProvider) {
      initCurrentUser();
    }
  }, [web3Modal, currentUser]);

  return <Provider value={{ web3Modal, setWeb3Modal, setCurrentUser, currentUser }}>{children}</Provider>;
}

export { Web3Context, Web3Provider, signInWithWeb3 };
