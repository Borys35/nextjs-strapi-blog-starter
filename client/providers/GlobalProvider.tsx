import { createContext, FC, useContext } from "react";
import { GlobalType } from "../lib/typings";

interface Props {
  value: GlobalType;
}

export const GlobalContext = createContext({} as GlobalType);

export const useGlobal = () => useContext(GlobalContext);

const GlobalProvider: FC<Props> = ({ children, value }) => {
  return (
    <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
  );
};

export default GlobalProvider;
