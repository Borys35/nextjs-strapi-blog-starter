import { gql } from "@apollo/client";
import { GetStaticProps, NextPage } from "next";
import Container from "../../components/atoms/container";
import Heading from "../../components/atoms/heading";
import BlogPost from "../../components/blog-post";
import Layout from "../../components/layout";
import { apolloClient } from "../../lib/apollo";
import { PostType } from "../../lib/typings";

const GET_ALL_POSTS = gql`
  {
    posts {
      data {
        id
        attributes {
          slug
          title
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
  }
`;

interface Props {
  posts: PostType[];
}

const Posts: NextPage<Props> = ({ posts }) => {
  return (
    <Layout
      title="Posts"
      description="There are all posts we have ever published to you!"
    >
      <div className="my-24">
        <Container>
          <Heading level={1} className="mb-4">
            Posts
          </Heading>
          <section className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 col-start-1 col-end-13">
            {posts.map((post) => (
              <BlogPost key={post.id} post={post} />
            ))}
          </section>
        </Container>
      </div>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await apolloClient.query({ query: GET_ALL_POSTS });

  const posts: PostType[] = data.posts.data;

  return {
    props: { posts },
    revalidate: 60,
  };
};

export default Posts;
