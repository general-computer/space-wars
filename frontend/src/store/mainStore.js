import { configureStore } from "@reduxjs/toolkit";

import dataSlice from "./data/dataSlice";
import sideMenuSlice from "./sideMenu/sideMenuSlice";
import userInfoSlice from "./userInfo/userInfoSlice";

const store = configureStore({
  reducer: {
    data: dataSlice.reducer,
    userInfo: userInfoSlice.reducer,
    sideMenu: sideMenuSlice.reducer,
  },
});

export default store;
