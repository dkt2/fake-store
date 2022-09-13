import Image from "next/image";
import React, { useEffect } from "react";
import { useAppSelector } from "store/hooks";
import { selectIsLoggedIn } from "store/slices/app";
import { Product } from "store/slices/shoppingCart";
import formatPrice from "util/formatPrice";
import ShoppingCart from "../ShoppingCart/ShoppingCart";
import classes from "./ProductTile.module.css";

interface ProductTileProps {
  product: Product;
}

function ProductTile(props: ProductTileProps) {
  const { product } = props;
  const isLoggedIn = useAppSelector(selectIsLoggedIn);

  return (
    <div className={classes.productTile}>
      <picture className={classes.productImage}>
        <source srcSet={product.image} type={"image/webp"} />
        <img src={product.image} alt={"Product Photo"} />
      </picture>
      <div className={classes.productTitle}>{product.title}</div>
      <div className={classes.productPrice}>
        {isLoggedIn || product.price < 500
          ? formatPrice(product.price)
          : "Sign in to view pricing"}
      </div>
      {isLoggedIn && <ShoppingCart product={product} />}
    </div>
  );
}

export default ProductTile;
