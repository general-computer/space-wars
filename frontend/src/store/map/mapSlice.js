import { createSlice } from "@reduxjs/toolkit";

export default createSlice({
  name: "map",
  initialState: {
    clickedShipIndex: null,
  },
  reducers: {
    clickShip(state, action) {
      const id = action.payload;
      state.clickedShipIndex = id;
    },
  },
});
