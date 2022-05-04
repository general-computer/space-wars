import { createSlice } from "@reduxjs/toolkit";

const walletSlice = createSlice({
  name: "data",
  initialState: {
    isConnected: false,
    walletAddress: "",
  },
  reducers: {
    changeWalletStatus(state, action) {
      const { addr } = action.payload;
      state.isConnected = true;
      state.walletAddress = addr;
    },
  },
});

export default walletSlice;
