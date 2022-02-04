import { FC } from "react";

const Container: FC = ({ children }) => {
  return (
    <div className="grid grid-cols-12 gap-x-4 max-w-7xl mx-auto px-6">
      {children}
    </div>
  );
};

export default Container;
