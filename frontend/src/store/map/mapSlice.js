import { createSlice } from "@reduxjs/toolkit";
import userInfoSlice from "../userInfo/userInfoSlice";

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
  extraReducers: (builder) => {
    builder.addCase(userInfoSlice.actions.confirmShip(), (state, action) => {
      const shipIndex = action.payload;
      state.clickedShipIndex = shipIndex;
    });
  },
});
