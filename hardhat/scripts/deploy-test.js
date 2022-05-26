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

  await spaceship.callStatic.mint(69);
  console.log('68+1 NFTs minted to', process.env.WALLET_ADDRESS);

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