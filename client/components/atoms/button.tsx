import classNames from "classnames";
import { FC } from "react";

interface Props {
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "default";
}

const sizes = {
  sm: "text-sm",
  md: "text-md",
  lg: "text-lg",
};

const variants = {
  primary: "bg-purple-600",
  default: "bg-gray-100",
};

const Button: FC<Props> = ({
  children,
  size = "md",
  variant = "default",
  className,
}) => {
  const classes = `px-4 py-2 font-bold`;
  const sizeClass = sizes[size];
  const variantClass = variants[variant];

  return (
    <button className={classNames(classes, sizeClass, variantClass, className)}>
      {children}
    </button>
  );
};

export default Button;
