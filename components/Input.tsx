import { Dispatch, SetStateAction } from "react";

interface Props {
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  type?: string;
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
