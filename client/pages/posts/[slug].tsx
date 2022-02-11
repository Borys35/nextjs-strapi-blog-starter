import { gql } from "@apollo/client";
import {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
  NextPage,
} from "next";
import Image from "next/image";
import Link from "next/link";
import { remark } from "remark";
import remarkHtml from "remark-html";
import sanitize from "sanitize-html";
import Container from "../../components/atoms/container";
import Heading from "../../components/atoms/heading";
import Layout from "../../components/layout";
import { API_URL, apolloClient } from "../../lib/apollo";
import { PostType } from "../../lib/typings";

const GET_ALL_POST_SLUGS = gql`
  {
    posts {
      data {
        id
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
    <Layout
      title={title}
      description={`It's blog post called \"${title}\" - Enjoy reading!`}
    >
      <div className="h-screen lg:h-128 overflow-hidden relative">
        <Image
          src={`${API_URL}${url}`}
          alt={alternativeText}
          layout="fill"
          objectFit="cover"
          priority
        />
        <div className="bg-gradient-to-r from-white via-white to-transparent absolute w-full h-full top-0 grid place-content-center">
          <Container>
            <div className="py-12 col-start-1 col-end-8 md:col-start-2">
              <div className="flex flex-wrap gap-x-8 mb-4">
                <Link href={`/categories/${category.data.attributes.slug}`}>
                  <a>{category.data.attributes.name}</a>
                </Link>
                <span>{new Date(publishedAt).toDateString()}</span>
                <span>
                  {Math.ceil(content.split(" ").length / 300)} min read
                </span>
              </div>
              <Heading level={1}>{title}</Heading>
            </div>
          </Container>
        </div>
      </div>
      <Container>
        <div
          className="leading-loose col-start-1 col-end-13 my-12 md:col-start-3 md:col-end-10 text-lg"
          dangerouslySetInnerHTML={{ __html: content }}
        ></div>
      </Container>
    </Layout>
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
  const processed = await remark()
    .use(remarkHtml)
    .process(post.attributes.content);
  const newPost = { ...post };
  newPost.attributes = {
    ...newPost.attributes,
    content: sanitize(processed.toString()),
  };

  return {
    props: { post: newPost },
    revalidate: 60,
  };
};

export default Post;
