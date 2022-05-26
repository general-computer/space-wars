/**
 * This deploys Spaceship in `contracts-exposed/Spaceship.sol`
 * Returns the deployed contract
 */

export async function deployExposed() {
  const [signer] = await ethers.getSigners();
  console.log("The deployer address is:", signer.address);

  const balance = await signer.getBalance();
  console.log("balance:", ethers.utils.formatEther(balance));

  const Spaceship = await ethers.getContractFactory("$Spaceship");

  const spaceship = await Spaceship.deploy();
  await spaceship.deployed();
  console.log("Spaceship deployed to:", spaceship.address);

  return spaceship;
}
