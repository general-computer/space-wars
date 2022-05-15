import { createSlice } from "@reduxjs/toolkit";

export default createSlice({
  name: "sideMenu",
  initialState: {
    clickedShipIndex: null,
    menuType: "info",
  },
  reducers: {
    clickShip(state, action) {
      const shipIndex = action.payload;
      state.clickedShipIndex = shipIndex;
      state.menuType = "info";
    },
    chooseMenuType(state, action) {
      const actionType = action.payload;
      state.menuType = actionType;
    },
  },
});
