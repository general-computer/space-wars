const hre = require("hardhat");

async function main() {
  const [signer] = await ethers.getSigners();
  console.log('The deployer address is:', signer.address);

  const balance = await signer.getBalance();
  console.log('balance:', ethers.utils.formatEther(balance));

  const Spaceship = await hre.ethers.getContractFactory("$Spaceship");

  const spaceship = await Spaceship.deploy();
  await spaceship.deployed();
  console.log("Spaceship deployed to:", spaceship.address);

  await spaceship.callStatic.safeMint(process.env.WALLET_ADDRESS);
  console.log('One NFT minted to', process.env.WALLET_ADDRESS);

  await spaceship.callStatic.startGame();
  console.log('Game forcefully started');

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