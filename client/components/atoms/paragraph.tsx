import classNames from "classnames";
import { FC } from "react";

interface Props {
  size?: "sm" | "md" | "lg";
  color?: "light" | "dark" | "black";
}

const sizes = {
  sm: "text-sm",
  md: "text-md",
  lg: "text-lg",
};

const colors = {
  light: "text-gray-600",
  dark: "text-gray-900",
  black: "text-black",
};

const Paragraph: FC<Props> = ({ children, size = "md", color = "dark" }) => {
  const sizeClass = sizes[size];
  const colorClass = colors[color];

  return (
    <p className={classNames("leading-normal", sizeClass, colorClass)}>
      {children}
    </p>
  );
};

export default Paragraph;
