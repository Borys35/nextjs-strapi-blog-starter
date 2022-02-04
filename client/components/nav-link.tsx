import Link from "next/link";
import { FC } from "react";

interface Props {
  to: string;
}

const NavLink: FC<Props> = ({ children, to }) => {
  return (
    <Link href={to}>
      <a>{children}</a>
    </Link>
  );
};

export default NavLink;
