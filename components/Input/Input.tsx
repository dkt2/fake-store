import { Dispatch, SetStateAction } from "react";

export enum InputType {
  TEXT = "text",
  PASSWORD = "password",
  NUMBER = "number",
}

type ValueType = string | number;

interface Props {
  value: ValueType;
  setValue: Dispatch<SetStateAction<ValueType>>;
  type?: InputType;
}

function Input({ value, setValue, type }: Props) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}

export default Input;
