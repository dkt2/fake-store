import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "store";
import { AsyncStatus } from "./types";

type ProductFromAPI = {
  id: number;
  title: string;
  price: number;
  image: string;

  // omit because they are currently not used
  // description: string,
  // category: string,
  // rating
};

type ProductFromCart = {
  productId: number;
  quantity: number;
};

export type Product = {
  image: string;
  title: string;
  price: number;
  id: number;
  quantity: number;
};

type CartUnprocessed = {
  id: number;
  userId: number;
  products: ProductFromCart[];
};

type Cart = Omit<CartUnprocessed, "products"> & {
  products: Product[];
};

type User = {
  id: number;
  username: string;

  /**
   * the following are omitted
   * because they are not currently used
   */
  // name
  // email
  // password
  // address
  // phone
};

export interface ShoppingCartState {
  status: AsyncStatus;
  carts: Cart[];
  currentCartID: number;
}

const initialState: ShoppingCartState = {
  status: AsyncStatus.IDLE,
  carts: null,
  currentCartID: null,
};

async function getProduct(
  product: ProductFromCart
): Promise<ProductFromAPI & { quantity: number }> {
  return fetch(`https://fakestoreapi.com/products/${product.productId}`)
    .then((res) => res.json())
    .then((data: ProductFromAPI) => ({ ...data, quantity: product.quantity }));
}

export const getCurrentUserShoppingCarts = createAsyncThunk(
  "shoppingCart/getCurrentUserShoppingCarts",
  async (payload: { username: string }) => {
    const { username: currentUsername } = payload;
    const users: User[] = await fetch("https://fakestoreapi.com/users").then(
      (res) => res.json()
    );
    const currentUser = users.find((user) => user.username === currentUsername);

    const cartsUnprocessed: CartUnprocessed[] = await fetch(
      `https://fakestoreapi.com/carts/user/${currentUser.id}`
    ).then((res) => res.json());

    const carts: Cart[] = await Promise.all(
      cartsUnprocessed.map(
        async (cart): Promise<Cart> => ({
          id: cart.id,
          userId: cart.userId,
          products: await Promise.all(
            cart.products.map((product) => getProduct(product))
          ),
        })
      )
    );

    return carts;
  }
);

const getCurrentCart = (state: ShoppingCartState) =>
  state.carts.find((cart) => cart.id === state.currentCartID);

export const shoppingCartSlice = createSlice({
  name: "shoppingCart",
  initialState,
  reducers: {
    setCart: (state, action: PayloadAction<number>) => {
      state.currentCartID = action.payload;
    },
    upsertProduct: (
      state,
      action: PayloadAction<{ product: Product; replace?: boolean }>
    ) => {
      const { product, replace } = action.payload;
      const currentCart = getCurrentCart(state);
      const foundIndex = currentCart.products.findIndex(
        (_product) => _product.id === product.id
      );
      if (foundIndex !== -1) {
        if (replace) {
          currentCart.products[foundIndex].quantity = product.quantity;
        } else {
          currentCart.products[foundIndex].quantity =
            Number(currentCart.products[foundIndex].quantity) +
            Number(product.quantity);
        }
      } else {
        currentCart.products.push(product);
      }
    },
    removeProduct: (state, action: PayloadAction<number>) => {
      const currentCart = getCurrentCart(state);
      currentCart.products = currentCart.products.filter(
        (product) => product.id !== action.payload
      );
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getCurrentUserShoppingCarts.pending, (state) => {
        state.status = AsyncStatus.LOADING;
      })
      .addCase(getCurrentUserShoppingCarts.fulfilled, (state, action) => {
        state.status = AsyncStatus.IDLE;
        state.carts = action.payload;
      })
      .addCase(getCurrentUserShoppingCarts.rejected, (state) => {
        state.status = AsyncStatus.FAILED;
      });
  },
});

export const { setCart, upsertProduct, removeProduct } =
  shoppingCartSlice.actions;

export const selectCarts = (state: RootState) => state.shoppingCart.carts;

export const selectHasCurrentCart = (state: RootState) =>
  !!state.shoppingCart.currentCartID;

export const selectCurrentCart = (state: RootState) =>
  state.shoppingCart.carts.find(
    (cart) => cart.id === state.shoppingCart.currentCartID
  );

export default shoppingCartSlice.reducer;
