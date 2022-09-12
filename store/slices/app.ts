import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AsyncStatus } from "./types";

/**
 * I deceded to use `createAsyncThunk`
 * to have a more Redux lib conventional way
 * of handling loading and error states
 *
 * When I was developing, the login API returned 524
 */
export const login = createAsyncThunk(
  "app/login",
  async (payload: { username: string; password: string }) => {
    const { username, password } = payload;
    const response = await fetch("https://fakestoreapi.com/auth/login", {
      method: "POST",
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });

    // This value becomes `fulfilled` action payload
    return response.json();
  }
);

export const appSlice = createSlice({
  name: "app",
  initialState: {
    categories: [],
    login: {
      token: "",
      status: AsyncStatus.IDLE,
    },
  },
  reducers: {
    setCategories: (state, action) => {
      state.categories = action.payload;
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
        state.login.token = action.payload;
        state.login.status = AsyncStatus.IDLE;
      })
      .addCase(login.rejected, (state) => {
        state.login.status = AsyncStatus.FAILED;
      });
  },
});

export const { setCategories } = appSlice.actions;

export const getAndSetCategories = () => (dispatch) => {
  fetch("https://fakestoreapi.com/products/categories")
    .then((res) => res.json())
    .then((data) => dispatch(setCategories(data)));
};

export const selectCategories = (state) => state.app.categories;

export default appSlice.reducer;
