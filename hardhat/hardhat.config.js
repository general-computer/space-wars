require("dotenv").config();
require("@nomiclabs/hardhat-ethers");
//require("@nomiclabs/hardhat-etherscan");
require('hardhat-exposed');

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    version: "0.8.9",
    settings: {
      optimizer: {enabled: true},
    }
  },

  defaultNetwork: "localhost",
  networks: {

    localhost: {
      url: "http://localhost:8545",
    }

  },

/*  etherscan: {
    apiKey: {
      mainnet: process.env.ETHERSCAN_API_KEY,
      rinkeby: process.env.ETHERSCAN_API_KEY
    },
  }*/
};
