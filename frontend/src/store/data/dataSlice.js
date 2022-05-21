import { createSlice } from "@reduxjs/toolkit";

const dataSlice = createSlice({
  name: "data",
  initialState: {
    // isDataLoaded: when the contract has replied with results
    isDataLoaded: false,
    mapLength: 0,
    zoneLength: 0,
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
      }
    */
    shipDataArray: [],
  },
  reducers: {
    showData(state, action) {
      const { mapLength, shipDataArray, zoneLength } = action.payload;
      return {
        ...state,
        isDataLoaded: true,
        mapLength,
        zoneLength,
        shipDataArray,
      };
    },
  },
});

export default dataSlice;
