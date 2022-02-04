import { gql } from "@apollo/client";
import {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
  NextPage,
} from "next";
import Image from "next/image";
import Link from "next/link";
import { API_URL, apolloClient } from "../../lib/apollo";
import { AuthorType } from "../../lib/typings";

const GET_ALL_AUTHOR_SLUGS = gql`
  {
    authors {
      data {
        attributes {
          slug
        }
      }
    }
  }
`;
const GET_AUTHOR = gql`
  query GetAuthor($slug: String!) {
    authors(filters: { slug: { eq: $slug } }) {
      data {
        id
        attributes {
          name
          slug
          posts {
            data {
              attributes {
                title
                content
                slug
                publishedAt
                cover {
                  data {
                    attributes {
                      url
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
  author: AuthorType;
}

const author: NextPage<Props> = ({ author }) => {
  const {
    attributes: { name, slug, avatar, posts },
  } = author;
  const { url, width, height, alternativeText } = avatar.data.attributes;

  return (
    <div>
      <Image
        src={`${API_URL}${url}`}
        width={width}
        height={height}
        alt={alternativeText}
        priority
      />
      <h1>NAME: {name}</h1>
      <div>
        {posts.data.map(({ id, attributes: { title, slug } }) => (
          <Link key={id} href={`/posts/${slug}`}>
            <a>{title}</a>
          </Link>
        ))}
      </div>
    </div>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const { data } = await apolloClient.query({ query: GET_ALL_AUTHOR_SLUGS });

  const authors: Pick<AuthorType, "attributes">[] = data.authors.data;
  const paths = authors.map(({ attributes: { slug } }) => ({
    params: { slug },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async (
  ctx: GetStaticPropsContext
) => {
  const { slug } = ctx.params as { slug: string };
  const { data } = await apolloClient.query({
    query: GET_AUTHOR,
    variables: { slug },
  });
  const [author] = data.authors.data as AuthorType[];

  return {
    props: {
      author,
    },
    revalidate: 60,
  };
};

export default author;
