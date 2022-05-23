/**
 * This script mint an extra ship in a deployed contract
 */
export async function mint1(contractName, contractAddr) {
  const spaceship = await ethers.getContractAt(contractName, contractAddr);

  console.log(`Minting one NFT to ${process.env.WALLET_ADDRESS}`);

  await spaceship.safeMint(process.env.WALLET_ADDRESS);
  console.log("One NFT minted to", process.env.WALLET_ADDRESS);

  const currentSupply = await spaceship.getCurrentSupply();
  console.log("Total NFT supply:", currentSupply - 1);
}
