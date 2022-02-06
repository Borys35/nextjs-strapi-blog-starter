import { FC } from "react";
import Input, { InputProps } from "./atoms/input";

interface Props {
  label?: string;
  error?: string;
  inputProps?: InputProps;
}

const Field: FC<Props> = ({ label, error, inputProps }) => {
  return (
    <div className="flex flex-col gap-1 text-lg min-w-0">
      {label && <label>{label}</label>}
      <Input {...inputProps} />
      {error && <span className="text-red-600">{error}</span>}
    </div>
  );
};

export default Field;
