import { createSlice } from "@reduxjs/toolkit";

const INITIALSTATE = {
  clickedShipIndex: null,
  menuType: "info",
  mockMoves: {
    transX: 0,
    transY: 0,
  },
  mockRangeIncr: 0,
};

export default createSlice({
  name: "sideMenu",
  initialState: INITIALSTATE,
  reducers: {
    clickShip(state, action) {
      const shipIndex = action.payload;
      return {
        ...INITIALSTATE,
        clickedShipIndex: shipIndex,
      };
    },
    chooseMenuType(state, action) {
      const actionType = action.payload;
      return {
        ...INITIALSTATE,
        clickedShipIndex: state.clickedShipIndex,
        menuType: actionType,
      };
    },
    tryMove(state, action) {
      const button = action.payload;

      const buttonMapMove = {
        1: { x: -1, y: 1 },
        2: { x: 0, y: 1 },
        3: { x: 1, y: 1 },
        4: { x: -1, y: 0 },
        5: { x: 0, y: 0 },
        6: { x: 1, y: 0 },
        7: { x: -1, y: -1 },
        8: { x: 0, y: -1 },
        9: { x: 1, y: -1 },
      };

      if (button === 5) {
        state.mockMoves.transX = 0;
        state.mockMoves.transY = 0;
      } else {
        state.mockMoves.transX += buttonMapMove[button].x;
        state.mockMoves.transY += buttonMapMove[button].y;
      }
    },
    tryUpgrade(state, action) {
      if (action.payload.currRange + state.mockRangeIncr >= 3) return;
      state.mockRangeIncr++;
    },
    tryRevertUpgrade(state) {
      if (state.mockRangeIncr < 0) return;
      state.mockRangeIncr--;
    },
  },
});
