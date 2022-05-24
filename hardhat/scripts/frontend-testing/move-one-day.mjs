/**
 * This moves a deployed spaceship contract one day forward
 */
import { deployExposed } from "./libraries/deployExposed.mjs";
async function main() {
  // Change this as appropriate
  const CONTRACT_ADDRESS = "0x5fbdb2315678afecb367f032d93f642f64180aa3";
  const spaceship = await ethers.getContractAt("$Spaceship", CONTRACT_ADDRESS);

  await spaceship.$moveGameOneDay();
  console.log(`Game forcifully fast-forwarded by one day`);
  const s_gameStartTime = await spaceship.s_gameStartTime();
  const currentDay = await spaceship.getCurrentDay();
  console.log("New gameStartTime:", +s_gameStartTime);
  console.log("On day:", +currentDay);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
