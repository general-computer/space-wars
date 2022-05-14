import { createSlice } from "@reduxjs/toolkit";

export default createSlice({
  name: "shipInfo",
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
    chooseAction(state, action) {
      const actionType = action.payload;
      state.menuType = actionType;
    },
  },
  /*   extraReducers: (builder) => {
    builder.addCase(userInfoSlice.actions.confirmShip, (state, action) => {
      const shipIndex = action.payload;
      state.clickedShipIndex = shipIndex;
      state.menuType = "info";
    });
  }, */
});
