/**
 * This deploys the exposed contract, then mint 2 NFTs, and then forcefully start
 */
import { deployExposed } from "./libraries/deployExposed.mjs";

async function main() {
  const spaceship = await deployExposed();
  const signerAddr = await spaceship.signer.getAddress();
  // const contractName = await spaceship.name();

  await spaceship.mint(69);
  console.log("69 NFTs minted to", signerAddr);

  const gameStartTime = +(await spaceship.s_gameStartTime());
  console.log("Game started at", gameStartTime);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
