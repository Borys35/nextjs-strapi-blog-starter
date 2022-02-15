import { FC, useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { useGlobal } from "../providers/GlobalProvider";
import Button from "./atoms/button";
import Container from "./atoms/container";
import Logo from "./logo";
import NavLink from "./nav-link";

const Nav: FC = () => {
  const [open, setOpen] = useState(false);
  const {
    attributes: { middleNavLinks, rightNavLinks },
  } = useGlobal();

  return (
    <nav className="bg-blue-400 relative">
      <Container>
        <div className="flex py-2 justify-between items-center col-start-1 col-end-13">
          <Logo />
          <div className="hidden lg:flex lg:gap-4 lg:items-center">
            {middleNavLinks.map(({ id, text, url, isButton }) =>
              isButton ? (
                <Button key={id} href={url} variant="primary">
                  {text}
                </Button>
              ) : (
                <NavLink key={id} to={url}>
                  {text}
                </NavLink>
              )
            )}
          </div>
          <div className="hidden lg:flex lg:gap-4 lg:items-center">
            {rightNavLinks.map(({ id, text, url, isButton }) =>
              isButton ? (
                <Button key={id} href={url} variant="primary">
                  {text}
                </Button>
              ) : (
                <NavLink key={id} to={url}>
                  {text}
                </NavLink>
              )
            )}
          </div>
          <div
            className="lg:hidden cursor-pointer"
            onClick={() => setOpen(!open)}
          >
            {!open ? <FaBars /> : <FaTimes />}
          </div>
        </div>
      </Container>
      {open && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-blue-500 py-4 z-10">
          <Container>
            <div className="flex flex-col gap-6 items-center col-start-1 col-end-13">
              {[...middleNavLinks, ...rightNavLinks].map(
                ({ id, text, url, isButton }) =>
                  isButton ? (
                    <Button key={id} href={url} variant="primary">
                      {text}
                    </Button>
                  ) : (
                    <NavLink key={id} to={url}>
                      {text}
                    </NavLink>
                  )
              )}
            </div>
          </Container>
        </div>
      )}
    </nav>
  );
};

export default Nav;
