import { createSlice } from "@reduxjs/toolkit";

export default createSlice({
  name: "userInfo",
  initialState: {
    walletAddress: "",
    isChoosingShip: false,
    ownerChosenShip: null,
  },
  reducers: {
    changeUserAddr(state, action) {
      const addr = action.payload;
      if (typeof addr !== "string") {
        throw new Error(
          `changeWalletAddr: "addr" must be of string type but got a ${typeof addr} "${addr}" instead`
        );
      }
      state.walletAddress = addr;
      state.ownerChosenShip = null;
      // Force the user to choose ship if a new address is detected
      if (state.walletAddress !== "") {
        state.isChoosingShip = true;
      }
    },
    // User choosing its own ship
    chooseShip(state) {
      state.isChoosingShip = true;
    },
    abortChoosingShip(state) {
      state.isChoosingShip = false;
    },
    confirmShip(state, action) {
      const shipIndex = action.payload;
      state.isChoosingShip = false;
      state.ownerChosenShip = shipIndex;
    },
  },
});
