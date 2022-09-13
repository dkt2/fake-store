import { configureStore } from "@reduxjs/toolkit";
import appReducer from "./slices/app";
import shoppingCartReducer from "./slices/shoppingCart";

const store = configureStore({
  reducer: {
    app: appReducer,
    shoppingCart: shoppingCartReducer,
  },
});

export default store;

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
