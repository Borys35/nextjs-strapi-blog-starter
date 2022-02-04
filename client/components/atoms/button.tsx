import { FC } from "react";

interface Props {}

const Button: FC<Props> = ({ children }) => {
  const classes = `px-4 py-2 bg-purple-600`;

  return <button className={classes}>{children}</button>;
};

export default Button;
