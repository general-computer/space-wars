import dataSlice from "./dataSlice";

// **************** The svg code is an example only
import SHIPS from "./utils/example_ships";

/******** Generating random sample tank data *****/
// The first three addresses in HardHat Network
const SAMPLE_OWNERS = [
  "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
  "0x70997970c51812dc3a010c7d01b50e0d17dc79c8",
  "0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc",
];
// Length of the whole map
const MAP_LENGTH = 100;
// The length of the ever reducing alive zone
const ZONE_LENGTH = 50;
// Random ship data
const NUM_OF_SPACESHIPS = 69;
// Random number generator
function genRandomNum(maxNum) {
  return Math.floor(Math.random() * (maxNum + 1));
}
const SHIP_DATA_ARRAY = (function () {
  const arr = [];
  for (let i = 0; i < NUM_OF_SPACESHIPS; i++) {
    const ship = {
      avatarString: SHIPS[genRandomNum(NUM_OF_SPACESHIPS) - 1],
      tokenId: genRandomNum(10000).toString(),
      owner: SAMPLE_OWNERS[genRandomNum(2)],
      posX: genRandomNum(MAP_LENGTH - 1),
      posY: genRandomNum(MAP_LENGTH - 1),
      /// Note: range = level + 1
      range: genRandomNum(2) + 1,
      actionPoints: genRandomNum(10),
      health: genRandomNum(3),
    };
    arr.push(ship);
  }
  return arr;
})();

/*****************************************/

/******** Faking data loading delay. Change it to a real data fetching function later ****/
async function timeoutFunc(timeout) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, timeout);
  });
}

export default function loadFakeData() {
  return async (dispatch) => {
    await timeoutFunc(1000);
    dispatch(
      dataSlice.actions.showData({
        mapLength: MAP_LENGTH,
        zoneLength: ZONE_LENGTH,
        shipDataArray: SHIP_DATA_ARRAY,
      })
    );
  };
}
