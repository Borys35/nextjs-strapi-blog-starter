import { gql } from "@apollo/client";
import { GetStaticProps, NextPage } from "next";
import Link from "next/link";
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
    <div className="flex flex-col gap-6">
      {posts.map(({ id, attributes: { title, slug } }) => (
        <Link key={id} href={`/posts/${slug}`}>
          <a>{title}</a>
        </Link>
      ))}
    </div>
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
