const path = require("path");
require('dotenv').config({path: './.env'});
const HDWalletProvider = require("@truffle/hdwallet-provider");
const MetaMaskAccountIndex = 0;

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    develop: {
      port: 8545
    },
    ganache_local: {
      provider: () =>
        new HDWalletProvider(
          process.env.MNEMONIC,
          "http://127.0.0.1:7545",
          MetaMaskAccountIndex
        ),
      network_id: 5777
    },
    goerli_infura: {
      provider: () =>
        new HDWalletProvider(
          process.env.MNEMONIC,
          process.env.GOERLI_INFURA,
          MetaMaskAccountIndex
        ),
      network_id: 5
    },
    ropsten_infura: {
      provider: () =>
        new HDWalletProvider(
          process.env.MNEMONIC,
          process.env.ROPSTEN_INFURA,
          MetaMaskAccountIndex
        ),
      network_id: 3
    }
  },
  compilers: {
    solc: {
      version: "^0.6.0"
    }
  }
};
