import Link from "next/link";
import { FC } from "react";
import { useGlobal } from "../providers/GlobalProvider";
import Container from "./atoms/container";
import Paragraph from "./atoms/paragraph";
import Logo from "./logo";

const Footer: FC = () => {
  const {
    attributes: { footerLinks },
  } = useGlobal();

  return (
    <footer className="bg-blue-400 text-center py-4">
      <Container>
        <div className="mb-3 col-start-1 col-end-13 place-self-center">
          <Logo />
        </div>
        <div className="mb-6 flex flex-wrap gap-x-4 justify-center col-start-1 col-end-13 sm:col-start-4 sm:col-end-10">
          {footerLinks.map(({ id, text, url, isButton }) => (
            <Link key={id} href={url}>
              <a>{text}</a>
            </Link>
          ))}
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
