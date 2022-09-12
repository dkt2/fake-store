import { configureStore } from "@reduxjs/toolkit";
import appReducer from "./slices/app";

const store = configureStore({
  reducer: {
    app: appReducer,
  },
});

export default store;

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
