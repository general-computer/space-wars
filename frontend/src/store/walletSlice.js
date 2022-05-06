import { createSlice } from "@reduxjs/toolkit";

const walletSlice = createSlice({
  name: "wallet",
  initialState: {
    walletAddress: "",
    mapTransformRef: null,
  },
  reducers: {
    changeWalletStatus(state, action) {
      const { addr } = action.payload;
      if (typeof addr !== "string")
        throw new Error(
          `changeWalletStatus: "addr" must be of string type but got a ${typeof addr} "${addr}" instead`
        );
      state.walletAddress = addr;
    },
    setmapTransformRef(state, action) {
      state.mapTransformRef = action.payload;
      console.dir(state.mapTransformRef);
    },
  },
});

export default walletSlice;
