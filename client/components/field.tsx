import { FC } from "react";
import Input, { InputProps } from "./atoms/input";

interface Props {
  name?: string;
  label?: string;
  error?: { message: string };
  inputProps?: InputProps;
}

const Field: FC<Props> = ({ name, label, error, inputProps }) => {
  return (
    <div className="flex flex-col gap-1 text-lg min-w-0">
      {label && <label>{label}</label>}
      <Input name={name} {...inputProps} />
      {error && <span className="text-red-600">{error.message}</span>}
    </div>
  );
};

export default Field;
