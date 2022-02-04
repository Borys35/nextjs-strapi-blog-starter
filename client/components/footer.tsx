import Link from "next/link";
import { FC } from "react";
import Container from "./atoms/container";
import Paragraph from "./atoms/paragraph";
import Logo from "./logo";

const Footer: FC = () => {
  return (
    <footer className="bg-blue-400 text-center py-4">
      <Container>
        <div className="mb-2 col-start-1 col-end-13">
          <Logo />
        </div>
        <div className="mb-5 flex flex-wrap gap-x-4 justify-center col-start-1 col-end-13 sm:col-start-4 sm:col-end-10">
          <Link href="/">
            <a>Home</a>
          </Link>
          <Link href="/about">
            <a>About</a>
          </Link>
          <Link href="/contact">
            <a>Contact</a>
          </Link>
          <Link href="/">
            <a>Home</a>
          </Link>
          <Link href="/about">
            <a>About</a>
          </Link>
          <Link href="/contact">
            <a>Contact</a>
          </Link>
          <Link href="/">
            <a>Home</a>
          </Link>
          <Link href="/about">
            <a>About</a>
          </Link>
          <Link href="/contact">
            <a>Contact</a>
          </Link>
          <Link href="/">
            <a>Home</a>
          </Link>
          <Link href="/about">
            <a>About</a>
          </Link>
          <Link href="/contact">
            <a>Contact</a>
          </Link>
        </div>
        <div className="col-start-1 col-end-13">
          <Paragraph size="sm" color="light">
            &copy; 2022 - {new Date().getFullYear()} Borys Kaczmarek
          </Paragraph>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
