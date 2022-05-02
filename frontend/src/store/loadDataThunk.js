import dataSlice from "./dataSlice";

/******** Generating random sample tank data *****/
const MAP_LENGTH = 100;
const NUM_OF_SPACESHIPS = 69;

const randXYArr = () => {
  const x = Math.floor(Math.random() * MAP_LENGTH);
  const y = Math.floor(Math.random() * MAP_LENGTH);
  return [x, y];
};

const SPACESHIP_XYPOS = (function () {
  const arr = [];
  for (let i = 0; i < NUM_OF_SPACESHIPS; i++) {
    arr.push(randXYArr());
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

export default function loadData() {
  return async (dispatch) => {
    await timeoutFunc(2000);
    console.log("Data Loaded");
    dispatch(
      dataSlice.actions.showData({
        mapLength: MAP_LENGTH,
        spaceshipXYPos: SPACESHIP_XYPOS,
      })
    );
  };
}
