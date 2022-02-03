import { gql } from "@apollo/client";
import {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
  NextPage,
} from "next";
import { apolloClient } from "../../lib/apollo";
import { PostType } from "../../lib/typings";

const GET_ALL_POST_SLUGS = gql`
  {
    posts {
      data {
        attributes {
          slug
        }
      }
    }
  }
`;
const GET_POST = gql`
  query GetPost($slug: String!) {
    posts(filters: { slug: { eq: $slug } }) {
      data {
        id
        attributes {
          slug
          title
          content
        }
      }
    }
  }
`;

interface Props {
  post: PostType;
}

const Post: NextPage<Props> = ({ post }) => {
  const { title, content } = post.attributes;

  return (
    <div>
      <h1>{title}</h1>
      <pre>{content}</pre>
    </div>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const { data } = await apolloClient.query({ query: GET_ALL_POST_SLUGS });

  const posts: Pick<PostType, "attributes">[] = data.posts.data;
  const paths = posts.map(({ attributes: { slug } }) => ({ params: { slug } }));

  console.log(paths);
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
    query: GET_POST,
    variables: { slug },
  });

  const [post] = data.posts.data as PostType[];

  return {
    props: { post },
    revalidate: 30,
  };
};

export default Post;
