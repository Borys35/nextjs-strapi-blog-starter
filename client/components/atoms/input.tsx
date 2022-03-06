import React, { FC } from "react";

export interface InputProps extends React.HTMLAttributes<HTMLInputElement> {
  name?: string;
  type?: string;
}

const Input: FC<InputProps> = React.forwardRef<HTMLInputElement, InputProps>(
  ({ name, type, ...props }, ref) => {
    const classes = "px-4 py-2 bg-gray-200";

    if (type === "textarea")
      return (
        <textarea
          ref={ref as any}
          name={name}
          className={classes}
          {...(props as any)}
        ></textarea>
      );
    return (
      <input ref={ref} name={name} type={type} className={classes} {...props} />
    );
  }
);

Input.displayName = "Input";

export default Input;
