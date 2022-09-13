import React from "react";
import classes from "./shoppingcart.module.css";
import Catalog from "@/components/Catalog/Catalog";
import { useAppDispatch, useAppSelector } from "store/hooks";
import {
  selectCarts,
  selectCurrentCart,
  selectHasCurrentCart,
  setCart,
} from "store/slices/shoppingCart";
import { selectIsLoggedIn } from "store/slices/app";

function SelectACart() {
  const dispatch = useAppDispatch();
  const carts = useAppSelector(selectCarts);

  return (
    <>
      <p>Select a cart:</p>
      <ul>
        {carts?.map((cart) => (
          <li key={cart.id}>
            <button onClick={() => dispatch(setCart(cart.id))}>
              Cart ID {cart.id}
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}

function DisplayCart() {
  const dispatch = useAppDispatch();
  const currentCart = useAppSelector(selectCurrentCart);

  return (
    <>
      <br />
      <button onClick={() => dispatch(setCart(null))}>
        Choose a different cart
      </button>
      <Catalog
        name={`Shopping Cart ID ${currentCart.id}`}
        products={currentCart.products}
      />
    </>
  );
}

function LoggedOut() {
  return <p>Please login to view your shopping cart</p>;
}

function ShoppingCart() {
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const hasCurrentCart = useAppSelector(selectHasCurrentCart);

  return (
    <div className={classes.root}>
      {isLoggedIn ? (
        hasCurrentCart ? (
          <DisplayCart />
        ) : (
          <SelectACart />
        )
      ) : (
        <LoggedOut />
      )}
    </div>
  );
}

export default ShoppingCart;
