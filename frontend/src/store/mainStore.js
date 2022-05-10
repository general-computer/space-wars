import { configureStore } from "@reduxjs/toolkit";

import dataSlice from "./data/dataSlice";
import mapSlice from "./map/mapSlice";
import userInfoSlice from "./userInfo/userInfoSlice";

const store = configureStore({
  reducer: {
    data: dataSlice.reducer,
    userInfo: userInfoSlice.reducer,
    map: mapSlice.reducer,
  },
});

export default store;
