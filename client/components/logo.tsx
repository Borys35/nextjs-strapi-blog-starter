import Link from "next/link";
import { FC } from "react";
import Heading from "./atoms/heading";

interface Props {
  className?: string;
}

const Logo: FC<Props> = ({ className }) => {
  return (
    <Link href="/">
      <a className={className}>
        <Heading level={4}>On Sight</Heading>
      </a>
    </Link>
  );
};

export default Logo;
