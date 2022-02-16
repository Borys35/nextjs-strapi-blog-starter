import { gql, useLazyQuery } from "@apollo/client";
import { GetStaticProps, NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Container from "../../components/atoms/container";
import Heading from "../../components/atoms/heading";
import Select from "../../components/atoms/select";
import BlogPost from "../../components/blog-post";
import Layout from "../../components/layout";
import { apolloClient } from "../../lib/apollo";
import { PostType } from "../../lib/typings";

const GET_ALL_POSTS = gql`
  query GetPosts($sort: [String]) {
    posts(sort: $sort) {
      data {
        id
        attributes {
          slug
          title
          content
          publishedAt
          category {
            data {
              attributes {
                name
                slug
              }
            }
          }
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
  const router = useRouter();
  const [loadPosts, { data }] = useLazyQuery(GET_ALL_POSTS);

  function handleChange(e: any) {
    router.push({ query: { sort: e.target.value } });
  }

  useEffect(() => {
    const { sort } = router.query;

    let sortOpt;
    if (sort === "latest") sortOpt = "publishedAt:desc";
    else if (sort === "oldest") sortOpt = "publishedAt:asc";
    else if (sort === "alphabetically") sortOpt = "title:asc";
    else sortOpt = "publishedAt:desc";

    loadPosts({ variables: { sort: sortOpt } });
  }, [router.query]);

  const rightPosts: PostType[] = data ? data.posts.data : posts;

  return (
    <Layout
      title="Posts"
      description="There are all posts we have ever published to you!"
    >
      <div className="my-24">
        <Container>
          <div className="flex items-end justify-between col-start-1 col-end-13 mb-4">
            <Heading level={1}>Posts</Heading>
            <Select onChange={handleChange}>
              <option value="latest">Latest</option>
              <option value="oldest">Oldest</option>
              <option value="alphabetically">Alphabetically</option>
            </Select>
          </div>
          <section className="grid gap-8 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 col-start-1 col-end-13">
            {rightPosts.map((post: PostType) => (
              <BlogPost key={post.id} post={post} />
            ))}
          </section>
        </Container>
      </div>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await apolloClient.query({
    query: GET_ALL_POSTS,
    variables: { sort: "publishedAt:desc" },
  });

  const posts: PostType[] = data.posts.data;

  return {
    props: { posts },
    revalidate: 60,
  };
};

export default Posts;
