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

function Input(props: Props) {
  const { value, setValue, type } = props;
  return (
    <input
      type={type || InputType.TEXT}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}

export default Input;
