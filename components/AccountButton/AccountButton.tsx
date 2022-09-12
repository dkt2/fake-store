import Link from "next/link";
import { User } from "react-feather";
import { useDispatch } from "react-redux";
import { useAppSelector } from "store/hooks";
import { selectIsLoggedIn, signOut } from "store/slices/app";
import classes from "./AccountButton.module.css";

function AccountButton() {
  const dispatch = useDispatch();
  const isLoggedIn = useAppSelector(selectIsLoggedIn);

  function onClick() {
    dispatch(signOut());
  }

  return (
    <Link href="/signin">
      <div className={classes.signIn}>
        <User />{" "}
        {isLoggedIn ? <button onClick={onClick}>Sign out</button> : "Sign In"}
      </div>
    </Link>
  );
}

export default AccountButton;
