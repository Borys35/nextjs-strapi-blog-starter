import { gql } from "@apollo/client";
import { GetStaticProps, NextPage } from "next";
import AuthorCard from "../../components/author-card";
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
    <div className="flex flex-col gap-6">
      {authors.map((author) => (
        <AuthorCard key={author.id} author={author} />
      ))}
    </div>
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
