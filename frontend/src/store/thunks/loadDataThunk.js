import dataSlice from "../dataSlice";

// **************** The svg code is an example only
import SHIPS from "./example_ships";

/******** Generating random sample tank data *****/
// Length of the whole map
const MAP_LENGTH = 100;
// The length of the ever reducing alive zone
const ZONE_LENGTH = 50;
// Random ship data
const NUM_OF_SPACESHIPS = 69;
const SHIP_DATA_ARRAY = (function () {
  const arr = [];
  for (let i = 0; i < NUM_OF_SPACESHIPS; i++) {
    const ship = {
      avatarString: SHIPS[genRandomNum(2)],
      tokenId: genRandomNum(1000000).toString(),
      owner: genRandomNum(100000000000).toString(16),
      posX: genRandomNum(MAP_LENGTH - 1),
      posY: genRandomNum(MAP_LENGTH - 1),
      actionPoints: genRandomNum(5),
      health: genRandomNum(3),
    };
    arr.push(ship);
  }
  return arr;
})();
function genRandomNum(maxNum) {
  return Math.floor(Math.random() * (maxNum + 1));
}
/*****************************************/

/******** Faking data loading delay. Change it to a real data fetching function later ****/
async function timeoutFunc(timeout) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, timeout);
  });
}

export default function loadData() {
  return async (dispatch) => {
    await timeoutFunc(2000);
    dispatch(
      dataSlice.actions.showData({
        mapLength: MAP_LENGTH,
        zoneLength: ZONE_LENGTH,
        shipDataArray: SHIP_DATA_ARRAY,
      })
    );
  };
}
