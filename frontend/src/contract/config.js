export const chainNames = {
  "0x1": "the Mainnet",
  "0x4": "Rinkeby Testnet",
  "0x7a69": "Hardhat Network",
};

const config = {
  // !!! This contract address may change
  CONTRACT_ADDRESS: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  // Hardhat
  TARGET_CHAIN: "0x7a69",
  // Set the required block confirmations here
  BLOCK_CONFIRMATIONS: 1,
};

export default config;
