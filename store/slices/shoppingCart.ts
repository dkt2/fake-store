import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "store";
import { AsyncStatus } from "./types";

/**
 * Unless otherwise noted,
 *  these types are to type
 *  the return values of external APIs
 */
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

/**
 * This type represents all the fields we need
 *  in order to display Product (ex. in ProductTile)
 */
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

async function getProduct(
  product: ProductFromCart
): Promise<ProductFromAPI & { quantity: number }> {
  return fetch(`https://fakestoreapi.com/products/${product.productId}`)
    .then((res) => res.json())
    .then((data: ProductFromAPI) => ({ ...data, quantity: product.quantity }));
}

/**
 * `createAsyncThunk` wraps Async work with states that
 *  can be selected on to show UI tracking the progress of the Async work.
 * Reference `extraReducer` below for more info.
 */
export const getCurrentUserShoppingCarts = createAsyncThunk(
  "shoppingCart/getCurrentUserShoppingCarts",
  async (payload: { username: string }) => {
    const { username: currentUsername } = payload;

    /**
     * The login API doesn't give us anything to identify the logged in user with.
     * So we have to find it based off of the username they give in the login form.
     */
    const users: User[] = await fetch("https://fakestoreapi.com/users").then(
      (res) => res.json()
    );

    /**
     * This is where we find the current user;
     *  we get the username to search for from the payload
     */
    const currentUser = users.find((user) => user.username === currentUsername);

    /**
     * Once we have the current user,
     *  we use that to query for their shopping carts.
     */
    const cartsUnprocessed: CartUnprocessed[] = await fetch(
      `https://fakestoreapi.com/carts/user/${currentUser.id}`
    ).then((res) => res.json());

    /**
     * Since the fields in the products returned from the carts API
     *  is different from the fields in the products we need for displaying products,
     *  we have to do an additional step of getting the products info we need
     *  through another API call
     */
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

    // This value becomes the `fulfilled` action payload
    return carts;
  }
);

const getCurrentCart = (state: ShoppingCartState) =>
  state.carts.find((cart) => cart.id === state.currentCartID);

interface ShoppingCartState {
  status: AsyncStatus;
  carts: Cart[];
  currentCartID: number;
}

const initialState: ShoppingCartState = {
  status: AsyncStatus.IDLE,
  carts: null,
  currentCartID: null,
};

export const shoppingCartSlice = createSlice({
  name: "shoppingCart",
  initialState,
  reducers: {
    /**
     * setCart to null to clear the currently selected cart
     */
    setCart: (state, action: PayloadAction<number>) => {
      state.currentCartID = action.payload;
    },
    /**
     * upsert = update + insert
     *
     * For adding/inserting:
     *  Before adding a product to the cart,
     *    it first checks if the product is already in the cart
     *    and increments its quantity if it exists
     *    otherwise it adds it with a quantity of 1
     *
     * For updating:
     *  Samething as adding/inserting, but
     *    without adding a product to the cart
     *    and it should replace the quantity with a new value.
     *  Set the `replace` field to `true` if using it for this use case
     */
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
    /**
     * These extra reducers are for displaying UI to track API progress.
     * You can get the status of a `fetch`
     *  by making a selector on `state.shoppingCart.status`.
     */
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
