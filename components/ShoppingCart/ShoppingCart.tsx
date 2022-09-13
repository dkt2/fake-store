import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAppDispatch } from "store/hooks";
import {
  upsertProduct,
  Product,
  removeProduct,
} from "store/slices/shoppingCart";
import Input, { InputType } from "../Input/Input";
import classes from "./ShoppingCart.module.css";

interface Props {
  product: Product;
}

function ShoppingCartControls(props: Props) {
  const { product } = props;
  const dispatch = useAppDispatch();

  return (
    <>
      <button
        onClick={() =>
          dispatch(
            upsertProduct({
              product,
              replace: true,
            })
          )
        }
      >
        Update quantity
      </button>
      <button onClick={() => dispatch(removeProduct(product.id))}>
        Remove from cart
      </button>
    </>
  );
}

function StoreControls(props: Props) {
  const { product } = props;
  const dispatch = useAppDispatch();
  return (
    <button onClick={() => dispatch(upsertProduct({ product }))}>
      Add to cart
    </button>
  );
}

function ShoppingCart(props: Omit<Props, "quantity">) {
  const { product } = props;
  const router = useRouter();
  const isInShoppingCart = router.pathname === "/shoppingcart";

  const [quantity, setQuantity] = useState(product.quantity || 1);

  return (
    <div className={classes.ShoppingCart}>
      <Input type={InputType.NUMBER} value={quantity} setValue={setQuantity} />
      {isInShoppingCart ? (
        <ShoppingCartControls product={{ ...product, quantity }} />
      ) : (
        <StoreControls product={{ ...product, quantity }} />
      )}
    </div>
  );
}

export default ShoppingCart;
