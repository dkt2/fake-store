import CategoryMenu from "../CategoryMenu/CategoryMenu";
import Image from "next/image";
import classes from "./Header.module.css";
import Link from "next/link";
import AccountButton from "../AccountButton";
import ShoppingCartLink from "../ShoppingCart/ShoppingCartLink";

function Header() {
  return (
    <div className={classes.siteHeader}>
      <div className={classes.left}>
        <div className={classes.siteLogo}>
          <Link href={"/"}>
            <Image
              src={require("../../assets/fakestorelogo.png")}
              alt={"Website logo"}
            />
          </Link>
        </div>
        <CategoryMenu />
      </div>
      <div className={classes.right}>
        <ShoppingCartLink />
        <AccountButton />
      </div>
    </div>
  );
}

export default Header;
