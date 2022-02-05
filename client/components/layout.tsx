import { FC } from "react";
import Footer from "./footer";
import Nav from "./nav";
import SEO, { SEOProps } from "./seo";

interface Props extends SEOProps {}

const Layout: FC<Props> = ({ children, title, description }) => {
  return (
    <>
      <SEO title={title} description={description} />
      <div className="min-h-screen flex flex-col">
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </>
  );
};

export default Layout;
