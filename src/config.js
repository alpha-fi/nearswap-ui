
function getConfig() {

    return {
      networkId: window.config.nearNetworkId,
      nodeUrl: window.config.nearNodeUrl,
      contractName: window.config.contractName,
      walletUrl: window.config.nearWalletUrl,
      helperUrl: window.config.nearHelperUrl,
      explorerUrl: window.config.nearExplorerUrl
    }
}

module.exports = getConfig
