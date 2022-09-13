import { useState } from "react";
import { login, selectIsLoggedIn, signOut } from "store/slices/app";
import classes from "./signin.module.css";
import { useAppDispatch, useAppSelector } from "store/hooks";
import Input, { InputType } from "@/components/Input/Input";
import { getCurrentUserShoppingCarts } from "store/slices/shoppingCart";

function LoggedOut() {
  const dispatch = useAppDispatch();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    await dispatch(login({ username, password }));
    await dispatch(getCurrentUserShoppingCarts({ username }));
  }

  return (
    <form>
      <label>
        Username
        <Input type={InputType.TEXT} value={username} setValue={setUsername} />
      </label>
      <label>
        Password
        <Input
          type={InputType.PASSWORD}
          value={password}
          setValue={setPassword}
        />
      </label>
      <button type={"submit"} onClick={(e) => onSubmit(e)}>
        Sign In
      </button>
    </form>
  );
}

function LoggedIn() {
  const dispatch = useAppDispatch();

  function onClick() {
    dispatch(signOut());
  }

  return <button onClick={onClick}>Sign out</button>;
}

export default function SignIn() {
  const dispatch = useAppDispatch();
  const isLoggedIn = useAppSelector(selectIsLoggedIn);

  return (
    <div className={classes.signIn}>
      {isLoggedIn ? <LoggedIn /> : <LoggedOut />}
    </div>
  );
}
