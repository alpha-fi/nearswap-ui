
function getConfig() {

    return {
      networkId: window.config.networkId,
      nodeUrl: window.config.nodeUrl,
      contractName: window.config.contractName,
      walletUrl: window.config.walletUrl,
      helperUrl: window.config.helperUrl,
      explorerUrl: window.config.explorerUrl
    }
}

module.exports = getConfig
