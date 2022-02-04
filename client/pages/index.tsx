import { ApolloError, gql } from "@apollo/client";
import type { GetStaticProps, NextPage } from "next";
import Link from "next/link";
import Layout from "../components/layout";
import { apolloClient } from "../lib/apollo";
import { CategoryType, PostType } from "../lib/typings";

const ALL_POST_QUERY = gql`
  {
    posts {
      data {
        id
        attributes {
          title
          publishedAt
          slug
          author {
            data {
              attributes {
                name
                avatar {
                  data {
                    attributes {
                      url
                    }
                  }
                }
              }
            }
          }
          cover {
            data {
              attributes {
                url
              }
            }
          }
        }
      }
    }
    categories {
      data {
        id
        attributes {
          name
          slug
          cover {
            data {
              attributes {
                url
              }
            }
          }
        }
      }
    }
  }
`;

interface Props {
  posts: PostType[];
  categories: CategoryType[];
  error: ApolloError;
}

const Home: NextPage<Props> = ({ posts, categories, error }) => {
  if (error) return <div>{error.message}</div>;

  return (
    <Layout>
      <h1>Next.js/Strapi Blog Starter</h1>

      <div className="p-4 bg-amber-300 flex gap-4">
        <Link href="/authors">
          <a>Authors</a>
        </Link>
        <Link href="/categories">
          <a>Categories</a>
        </Link>
        <Link href="/posts">
          <a>Posts</a>
        </Link>
      </div>

      <div>
        {categories.map(({ id, attributes: { name } }) => (
          <div key={id}>{name}</div>
        ))}
      </div>

      <div>
        {posts.map(({ id, attributes: { title } }) => (
          <div key={id}>{title}</div>
        ))}
      </div>

      <Link href={`/posts/${posts[0].attributes.slug}`}>
        <a>CLICK: {posts[0].attributes.title}</a>
      </Link>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const { data, error } = await apolloClient.query({ query: ALL_POST_QUERY });

  if (error)
    return {
      props: { error },
    };

  return {
    props: { posts: data.posts.data, categories: data.categories.data },
    revalidate: 30,
  };
};

export default Home;
