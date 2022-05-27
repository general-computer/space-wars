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
            const { tokenId, x, y } = action.payload;
            const targetShipIndex = state.shipDataArray.findIndex(
              (shipData) => shipData.tokenId === tokenId
            );
            if (targetShipIndex < 0) {
              throw new Error(
                "dataSlice.reducers.mapEvent: tokenId does not match any ships in state.data.shipDataArray"
              );
            }
            Object.assign(state.shipDataArray[targetShipIndex], {
              posX: x,
              posY: y,
            });
          })();
          break;
        default:
      }
      console.log(`Event type "${actionType}" successfully mapped`);
    },
  },
});

export default dataSlice;
