import { createSlice } from "@reduxjs/toolkit";

const dataSlice = createSlice({
  name: "data",
  initialState: {
    isDataLoaded: false,
    mapLength: 0,
    spaceshipXYPos: [],
    // For testing:
    /* isDataLoaded: true,
    mapLength: 100,
    spaceshipXYPos: [], */
  },
  reducers: {
    showData(state, action) {
      const { mapLength, spaceshipXYPos } = action.payload;
      return { ...state, isDataLoaded: true, mapLength, spaceshipXYPos };
    },
  },
});

export default dataSlice;
