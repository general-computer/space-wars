/**
 * This script mint an extra ship in a deployed contract
 */
export async function mint1(contractName, contractAddr) {
  const spaceship = await ethers.getContractAt(contractName, contractAddr);
  const signerAddr = await spaceship.signer.getAddress();

  console.log(`Minting one NFT to ${signerAddr}`);

  await spaceship.mint(1);
  console.log("One NFT minted to", signerAddr);

  const currentSupply = await spaceship.getCurrentSupply();
  console.log("Total NFT supply:", currentSupply - 1);
}
