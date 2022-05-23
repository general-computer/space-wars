/**
 * This deploys the exposed contract, then mint 2 NFTs, and then forcefully start
 */
import { deployExposed } from "./libraries/deployExposed.mjs";
import { forcefulStart } from "./libraries/forcefulStart.mjs";
import { mint1 } from "./libraries/mint1.mjs";

async function main() {
  const spaceship = await deployExposed();
  const contractName = await spaceship.name();
  await mint1(contractName, spaceship.address);
  await mint1(contractName, spaceship.address);
  await forcefulStart(contractName, spaceship.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
