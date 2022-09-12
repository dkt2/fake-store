import { useState } from "react";
import { login, selectIsLoggedIn, signOut } from "store/slices/app";
import classes from "./signin.module.css";
import Input from "components/Input";
import { useAppDispatch, useAppSelector } from "store/hooks";

function LoggedOut() {
  const dispatch = useAppDispatch();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function onSubmit(e) {
    e.preventDefault();
    dispatch(login({ username, password }));
  }

  return (
    <form>
      <label>
        Username
        <Input type={"text"} value={username} setValue={setUsername} />
      </label>
      <label>
        Password
        <Input type={"password"} value={password} setValue={setPassword} />
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
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  return (
    <div className={classes.signIn}>
      {isLoggedIn ? <LoggedIn /> : <LoggedOut />}
    </div>
  );
}
