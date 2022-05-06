import { createSlice } from "@reduxjs/toolkit";

export default createSlice({
  name: "ui",
  initialState: {
    //   The ship that is CLICKED to see info (not the owner's ship)
    clickedShipIndex: null,
  },
  reducers: {
    clickShip(state, action) {
      const id = action.payload;
      state.clickedShipIndex = id;
      /* For debugging */
      console.log(`uiSlice.clickedShip: ${id}`);
    },
  },
});
