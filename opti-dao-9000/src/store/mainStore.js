import { configureStore } from "@reduxjs/toolkit";

import exampleSlice from "./exampleSlice";

const store = configureStore({
  reducer: {
    example: exampleSlice.reducer,
  },
});

export const actions = {
  example: exampleSlice.actions,
};

export default store;
