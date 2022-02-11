import { NextPage } from "next";
import Container from "../components/atoms/container";
import Heading from "../components/atoms/heading";
import Layout from "../components/layout";

const About: NextPage = () => {
  return (
    <Layout title="About" description="Get to know us better!">
      <header>
        <Container>
          <div className="col-start-1 col-end-13 grid place-content-center bg-cyan-400">
            <Heading level={1}>About us!</Heading>
          </div>
        </Container>
      </header>
      <section>
        
      </section>
    </Layout>
  );
};

export default About;
