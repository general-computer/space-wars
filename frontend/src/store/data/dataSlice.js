import { createSlice } from "@reduxjs/toolkit";

const dataSlice = createSlice({
  name: "data",
  initialState: {
    // isDataLoaded: when the contract has replied with results
    isDataLoaded: false,
    mapLength: 0,
    zoneLength: 0,
    gameStartTime: 0,
    // The array below is has items with this structure:
    /* 
      {
        avatarString: "",
        tokenId: genRandomNum(1000000).toString(),
        owner: genRandomNum(100000000000).toString(16),
        posX: genRandomNum(MAP_LENGTH - 1),
        posY: genRandomNum(MAP_LENGTH - 1),
        level: genRandomNum(2) + 1,
        actionPoints: genRandomNum(5),
        health: genRandomNum(3),
        lastSimulatedDay: block.timestamp
      }
    */
    shipDataArray: [],
  },
  reducers: {
    showData(state, action) {
      const { mapLength, shipDataArray, zoneLength, gameStartTime } =
        action.payload;
      return {
        ...state,
        isDataLoaded: true,
        mapLength,
        zoneLength,
        gameStartTime,
        shipDataArray,
      };
    },
    mapEvent(state, action) {
      const { actionType } = action.payload;
      switch (actionType) {
        case "move":
          (() => {
            const { tokenId, x: newX, y: newY } = action.payload;
            const targetShipIndex = getShipIndexFromTokenId(
              tokenId,
              state.shipDataArray
            );
            if (!numsAreValid([newX, newY], (num) => num > 0)) {
              throw new Error(
                `dataSlice.reducers.mapEvent: (${newX},${newY}) are not valid co-ordinates`
              );
            }
            // check the number of moves for dedecuting APs
            const {
              posX: origX,
              posY: origY,
              actionPoints: origAP,
            } = state.shipDataArray[targetShipIndex];
            const moves = Math.max(
              Math.abs(newX - origX),
              Math.abs(newY - origY)
            );
            Object.assign(state.shipDataArray[targetShipIndex], {
              posX: newX,
              posY: newY,
              actionPoints: origAP - moves,
            });
          })();
          break;
        // case "upgrade":
        //   (() => {
        //     const { tokenId, level } = action.payload;
        //     const targetShipIndex = getShipIndexFromTokenId(
        //       tokenId,
        //       state.shipDataArray
        //     );
        //     if (!numsAreValid([level], (num) => num > 0)) {
        //       throw new Error(
        //         `dataSlice.reducers.mapEvent: ${level} is not a valid level`
        //       );
        //     }
        //     Object.assign(state.shipDataArray[targetShipIndex], {
        //       level,
        //       /// TODO: how many levels changed and deduct AP!!!
        //     });
        //   })();
        //   break;
        default:
          throw new Error(
            `dataSlice.reducers.mapEvent: unrecognised actionType "${actionType}"`
          );
      }
      console.log(`One "${actionType}" action successfully mapped`);
    },
  },
});

export default dataSlice;

const getShipIndexFromTokenId = (tokenId, shipDataArray) => {
  const targetShipIndex = shipDataArray.findIndex(
    (shipData) => shipData.tokenId === tokenId
  );
  if (targetShipIndex < 0) {
    throw new Error(
      `dataSlice.getShipIndexFromTokenId: tokenId ${tokenId} does not match any ships in state.data.shipDataArray`
    );
  }
  return targetShipIndex;
};

const numsAreValid = (numArr, extraTest) => {
  for (const num of numArr) {
    if (typeof num !== "number" || isNaN(num)) {
      return false;
    }
    if (typeof extraTest === "function") {
      if (!extraTest(num)) {
        return false;
      }
    }
  }
  return true;
};
