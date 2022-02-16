import classNames from "classnames";
import { FC } from "react";

interface Props extends React.HTMLAttributes<HTMLSelectElement> {}

const Select: FC<Props> = ({ children, className, ...props }) => {
  return (
    <select
      className={classNames("px-4 py-2 bg-gray-200", className)}
      {...props}
    >
      {children}
    </select>
  );
};

export default Select;
