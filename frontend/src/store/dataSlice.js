import { createSlice } from "@reduxjs/toolkit";

const dataSlice = createSlice({
  name: "data",
  initialState: {
    isDataLoaded: false,
    mapLength: 0,
    zoneLength: 0,
    spaceshipXYPos: [],
    // For testing:
    /* isDataLoaded: true,
    mapLength: 100,
    zoneLength: 70,
    spaceshipXYPos: [], */
  },
  reducers: {
    showData(state, action) {
      const { mapLength, spaceshipXYPos, zoneLength } = action.payload;
      return {
        ...state,
        isDataLoaded: true,
        mapLength,
        zoneLength,
        spaceshipXYPos,
      };
    },
  },
});

export default dataSlice;
