/**
 * This forcefully starts the game to allow display of data. Needs to have the exposed contract
 * No minting is possible after the game has started
 */

export async function forcefulStart(contractName, contractAddr) {
  const spaceship = await ethers.getContractAt(contractName, contractAddr);

  await spaceship.startGame();
  console.log("Game forcefully started");
}
