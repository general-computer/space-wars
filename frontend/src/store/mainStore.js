import { configureStore } from "@reduxjs/toolkit";

import dataSlice from "./dataSlice";
import walletSlice from "./walletSlice";
import uiSlice from "./uiSlice";

const store = configureStore({
  reducer: {
    data: dataSlice.reducer,
    wallet: walletSlice.reducer,
    ui: uiSlice.reducer,
  },
});

export default store;
