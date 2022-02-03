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
          publishedAt
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
          category {
            data {
              attributes {
                name
                slug
              }
            }
          }
        }
      }
    }
  }
`;

interface Props {
  post: PostType;
}

const Post: NextPage<Props> = ({ post }) => {
  const { title, content, publishedAt, cover, category } = post.attributes;
  const { url, width, height, alternativeText } = cover.data.attributes;

  return (
    <div>
      <Image
        src={`${API_URL}${url}`}
        width={width}
        height={height}
        alt={alternativeText}
      />
      <Link href={`/categories/${category.data.attributes.slug}`}>
        <a>{category.data.attributes.name}</a>
      </Link>
      <span>{new Date(publishedAt).toDateString()}</span>
      <span>{Math.ceil(content.split(" ").length / 300)} min read</span>
      <h1>{title}</h1>
      <pre>{content}</pre>
    </div>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const { data } = await apolloClient.query({ query: GET_ALL_POST_SLUGS });

  const posts: Pick<PostType, "attributes">[] = data.posts.data;
  const paths = posts.map(({ attributes: { slug } }) => ({ params: { slug } }));

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
    revalidate: 60,
  };
};

export default Post;
