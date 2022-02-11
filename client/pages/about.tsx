import { gql } from "@apollo/client";
import { GetStaticProps, NextPage } from "next";
import { remark } from "remark";
import remarkHtml from "remark-html";
import sanitize from "sanitize-html";
import Container from "../components/atoms/container";
import Heading from "../components/atoms/heading";
import RichContent from "../components/atoms/rich-content";
import Layout from "../components/layout";
import { apolloClient } from "../lib/apollo";
import { AboutType } from "../lib/typings";

const GET_ABOUT_ATTRIBUTES = gql`
  {
    about {
      data {
        attributes {
          heading
          content
        }
      }
    }
  }
`;

interface Props {
  about: AboutType;
}

const About: NextPage<Props> = ({ about }) => {
  const {
    attributes: { heading, content },
  } = about;

  return (
    <Layout title="About" description="Get to know us better!">
      <header className="bg-cyan-400">
        <Container>
          <div className="col-start-1 col-end-13 grid place-content-center h-80">
            <Heading level={1}>{heading}</Heading>
          </div>
        </Container>
      </header>
      <section>
        <Container>
          <RichContent
            html={content}
            className="col-start-1 col-end-13 md:col-start-2 md:col-end-12 my-12"
          />
        </Container>
      </section>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const { data, error } = await apolloClient.query({
    query: GET_ABOUT_ATTRIBUTES,
  });

  if (error)
    return {
      props: { error },
    };

  const rawAbout: AboutType = data.about.data;
  const processed = await remark()
    .use(remarkHtml)
    .process(rawAbout.attributes.content);
  const about = { ...rawAbout };
  about.attributes = {
    ...about.attributes,
    content: sanitize(processed.toString()),
  };

  return {
    props: {
      about,
    },
    revalidate: 60,
  };
};

export default About;
