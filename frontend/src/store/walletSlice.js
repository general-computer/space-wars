import { createSlice } from "@reduxjs/toolkit";

const walletSlice = createSlice({
  name: "wallet",
  initialState: {
    isConnected: false,
    walletAddress: "",
  },
  reducers: {
    changeWalletStatus(state, action) {
      const { addr } = action.payload;
      if (typeof addr !== "string")
        throw new Error(
          `changeWalletStatus: "addr" must be of string type but got a ${typeof addr} "${addr}" instead`
        );
      state.isConnected = addr !== "";
      state.walletAddress = addr;
    },
  },
});

export default walletSlice;
