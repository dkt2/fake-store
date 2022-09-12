import { useState } from "react";
import { login } from "store/slices/app";
import classes from "./signin.module.css";
import Input from "components/Input";

export default function SignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function onSubmit(e) {
    e.preventDefault();
    login("username", "password");
  }

  return (
    <div className={classes.signIn}>
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
    </div>
  );
}
