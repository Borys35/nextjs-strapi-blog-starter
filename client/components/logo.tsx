import Link from "next/link";
import { FC } from "react";
import { useGlobal } from "../providers/GlobalProvider";
import Heading from "./atoms/heading";

interface Props {
  className?: string;
}

const Logo: FC<Props> = ({ className }) => {
  const {
    attributes: { siteName },
  } = useGlobal();

  return (
    <Link href="/">
      <a className={className}>
        <Heading level={4}>{siteName}</Heading>
      </a>
    </Link>
  );
};

export default Logo;
