const hre = require("hardhat");
const { networkConfig } = require("./../helper-hardhat-config");

const chainId = network.config.chainId;

async function main() {
  const [signer] = await ethers.getSigners();
  console.log('The deployer address is:', signer.address);

  const balance = await signer.getBalance();
  console.log('balance:', ethers.utils.formatEther(balance));

  subscriptionId = process.env.VRF_SUBSCRIPTION_ID;
  linkTokenAddress = networkConfig[chainId]["linkToken"];
  vrfCoordinatorAddress = networkConfig[chainId]["vrfCoordinator"];
  const keyHash = networkConfig[chainId]["keyHash"];

  const Spaceship = await hre.ethers.getContractFactory("Spaceship");

  const spaceship = await Spaceship.deploy(subscriptionId, vrfCoordinatorAddress, keyHash);
  await spaceship.deployed();
  console.log("Spaceship deployed to:", spaceship.address);

  const testWallet = new ethers.Wallet(process.env.EXPOSED_TEST_KEY, ethers.provider);
  spaceshipTest = spaceship.connect(testWallet);
  await spaceshipTest.mint(69);

  return [Spaceship, spaceship];
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

module.exports = function() {
  this.hre = hre;
  this.main = main;
}