import { configureStore } from "@reduxjs/toolkit";

import dataSlice from "./data/dataSlice";
import shipInfo from "./shipInfo/shipInfoSlice";
import userInfoSlice from "./userInfo/userInfoSlice";

const store = configureStore({
  reducer: {
    data: dataSlice.reducer,
    userInfo: userInfoSlice.reducer,
    shipInfo: shipInfo.reducer,
  },
});

export default store;
