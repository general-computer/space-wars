import { configureStore } from "@reduxjs/toolkit";

import dataSlice from "./dataSlice";
import walletSlice from "./walletSlice";

const store = configureStore({
  reducer: {
    data: dataSlice.reducer,
    wallet: walletSlice.reducer,
  },
});

export default store;
