import { gql } from "@apollo/client";
import { GetStaticProps, NextPage } from "next";
import Container from "../../components/atoms/container";
import Heading from "../../components/atoms/heading";
import AuthorCard from "../../components/author-card";
import Layout from "../../components/layout";
import { apolloClient } from "../../lib/apollo";
import { AuthorType } from "../../lib/typings";

const GET_ALL_AUTHORS = gql`
  {
    authors {
      data {
        id
        attributes {
          name
          slug
          description
          posts {
            data {
              id
              attributes {
                title
                slug
                cover {
                  data {
                    attributes {
                      url
                      width
                      height
                      alternativeText
                    }
                  }
                }
              }
            }
          }
          avatar {
            data {
              attributes {
                url
                width
                height
                alternativeText
              }
            }
          }
        }
      }
    }
  }
`;

interface Props {
  authors: AuthorType[];
}

const Authors: NextPage<Props> = ({ authors }) => {
  return (
    <Layout
      title="Posts"
      description="There are all posts we have ever published to you!"
    >
      <div className="my-24">
        <Container>
          <Heading level={1} className="mb-4">
            Authors
          </Heading>
          <div className="grid lg:grid-cols-2 gap-4 col-start-1 col-end-13">
            {authors.map((author) => (
              <AuthorCard key={author.id} author={author} />
            ))}
          </div>
        </Container>
      </div>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await apolloClient.query({ query: GET_ALL_AUTHORS });

  const authors: AuthorType[] = data.authors.data;

  return {
    props: { authors },
    revalidate: 60,
  };
};

export default Authors;
