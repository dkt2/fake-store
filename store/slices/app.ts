import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "store";
import { AsyncStatus } from "./types";

/**
 * I deceded to use `createAsyncThunk`
 *  to have a more Redux lib conventional way
 *  of handling loading and error states
 */
export const login = createAsyncThunk(
  "app/login",
  async (payload: { username: string; password: string }) => {
    const { username, password } = payload;

    const response = await fetch("https://fakestoreapi.com/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    }).then((response) => response.json());

    // This value becomes `fulfilled` action payload
    return [username, response.token];
  }
);

export const selectIsLoggedIn = (state: RootState) =>
  state.app.login.token !== "";

export const selectUsername = (state: RootState) => state.app.login.username;

export const appSlice = createSlice({
  name: "app",
  initialState: {
    categories: [],
    login: {
      username: "",
      token: "",
      status: AsyncStatus.IDLE,
    },
  },
  reducers: {
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
    signOut: (state) => {
      state.login.token = "";
    },
  },
  /**
   * These are the states that `createAsyncThunk` returns
   * and how they will be handled
   */
  extraReducers(builder) {
    builder
      .addCase(login.pending, (state) => {
        state.login.status = AsyncStatus.LOADING;
      })
      .addCase(login.fulfilled, (state, action) => {
        const [username, token] = action.payload;
        state.login.status = AsyncStatus.IDLE;
        state.login.username = username;
        state.login.token = token;
      })
      .addCase(login.rejected, (state) => {
        state.login.status = AsyncStatus.FAILED;
      });
  },
});

export const { setCategories, signOut } = appSlice.actions;

export const getAndSetCategories = () => (dispatch) => {
  fetch("https://fakestoreapi.com/products/categories")
    .then((res) => res.json())
    .then((data) => dispatch(setCategories(data)));
};

export const selectCategories = (state) => state.app.categories;

export default appSlice.reducer;
