import classNames from "classnames";
import Link from "next/link";
import { FC } from "react";

interface Props {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "primary" | "default";
  href?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const sizes = {
  sm: "text-sm",
  md: "text-md px-6",
  lg: "text-lg px-8",
  xl: "text-lg px-10 py-3",
};

const variants = {
  primary: "bg-purple-600",
  default: "bg-gray-100",
};

const Button: FC<Props> = ({
  children,
  size = "md",
  variant = "default",
  href,
  onClick,
  className,
}) => {
  const classes = `inline-block px-4 py-2 font-bold`;
  const sizeClass = sizes[size];
  const variantClass = variants[variant];
  const finalClasses = classNames(classes, sizeClass, variantClass, className);

  if (href) {
    if (href.startsWith("/"))
      return (
        <Link href={href}>
          <a className={finalClasses}>{children}</a>
        </Link>
      );

    return (
      <a href={href} target="_blank" className={finalClasses}>
        {children}
      </a>
    );
  }

  return (
    <button className={finalClasses} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
