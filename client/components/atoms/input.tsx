import { FC } from "react";

export interface InputProps extends React.HTMLAttributes<HTMLInputElement> {
  type?: string;
}

const Input: FC<InputProps> = ({ type, ...props }) => {
  const classes = "px-4 py-2 bg-gray-200";

  if (type === "textarea") return <textarea className={classes}></textarea>;
  return <input type={type} className={classes} {...props} />;
};

export default Input;
