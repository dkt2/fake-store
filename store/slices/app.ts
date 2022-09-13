import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "store";
import { AsyncStatus } from "./types";

export const getAndSetCategories = () => (dispatch) => {
  fetch("https://fakestoreapi.com/products/categories")
    .then((res) => res.json())
    .then((data) => dispatch(setCategories(data)));
};

/**
 * `createAsyncThunk` wraps Async work with states that
 *  can be selected on to show UI tracking the progress of the Async work.
 * Reference `extraReducer` below for more info.
 */
export const login = createAsyncThunk(
  "app/login",
  async (payload: {
    username: string;
    password: string;
  }): Promise<
    [
      string, // username
      string // token
    ]
  > => {
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

    // This value becomes the `fulfilled` action payload
    return [username, response.token];
  }
);

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
   * These extra reducers are for displaying UI to track API progress.
   * You can get the status of a `fetch`
   *  by making a selector on `state.app.login.status`.
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

export const selectCategories = (state) => state.app.categories;

export const selectIsLoggedIn = (state: RootState) =>
  state.app.login.token !== "";

export default appSlice.reducer;
