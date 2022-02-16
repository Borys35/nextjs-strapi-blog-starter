import { gql, useLazyQuery } from "@apollo/client";
import { GetStaticProps, NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Button from "../../components/atoms/button";
import Container from "../../components/atoms/container";
import Heading from "../../components/atoms/heading";
import Select from "../../components/atoms/select";
import BlogPost from "../../components/blog-post";
import Layout from "../../components/layout";
import { apolloClient } from "../../lib/apollo";
import { MetaType, PostType } from "../../lib/typings";

const GET_ALL_POSTS = gql`
  query GetPosts($sort: [String], $page: Int) {
    posts(sort: $sort, pagination: { page: $page, pageSize: 6 }) {
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
      meta {
        pagination {
          pageCount
        }
      }
    }
  }
`;

interface Props {
  posts: PostType[];
  meta: MetaType;
}

const Posts: NextPage<Props> = ({ posts, meta }) => {
  const router = useRouter();
  const [loadPosts, { data }] = useLazyQuery(GET_ALL_POSTS);

  function handleChange(e: any) {
    router.push({ query: { sort: e.target.value } }, undefined, {
      shallow: true,
    });
  }

  function handleChangePage(page: number) {
    router.push({ query: { sort: router.query.sort, page } }, undefined, {
      shallow: true,
    });
  }

  function handleNextPage() {
    const { page } = router.query;
    if (!page)
      return router.push(
        { query: { sort: router.query.sort, page: 2 } },
        undefined,
        { shallow: true }
      );

    const pageNum = parseInt(page as string) + 1;
    if (pageNum > meta.pagination.pageCount) return;

    router.push(
      { query: { sort: router.query.sort, page: pageNum } },
      undefined,
      { shallow: true }
    );
  }

  function handlePrevPage() {
    const { page } = router.query;
    if (!page) return;

    const pageNum = parseInt(page as string) - 1;
    if (pageNum <= 0) return;

    router.push(
      { query: { sort: router.query.sort, page: pageNum } },
      undefined,
      { shallow: true }
    );
  }

  useEffect(() => {
    const { sort, page } = router.query;

    let pageNum = parseInt(page as string);

    if (pageNum < 1 || pageNum > meta.pagination.pageCount) {
      if (pageNum < 1) pageNum = 1;
      else if (pageNum > meta.pagination.pageCount)
        pageNum = meta.pagination.pageCount;

      router.push(
        { query: { sort: router.query.sort, page: pageNum } },
        undefined,
        { shallow: true }
      );
    } else {
      let sortOpt;
      if (sort === "latest") sortOpt = "publishedAt:desc";
      else if (sort === "oldest") sortOpt = "publishedAt:asc";
      else if (sort === "alphabetically") sortOpt = "title:asc";
      else sortOpt = "publishedAt:desc";

      loadPosts({ variables: { sort: sortOpt, page: pageNum } });
    }
  }, [router.query]);

  const currentPage = router.query.page
    ? parseInt(router.query.page as string)
    : 1;
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
            {rightPosts.map((post) => (
              <BlogPost key={post.id} post={post} />
            ))}
          </section>
          <div className="flex justify-center gap-1 mt-8 col-start-1 col-end-13">
            <Button onClick={() => handlePrevPage()}>Prev</Button>
            {Array(meta.pagination.pageCount)
              .fill(null)
              .map((_, i) => (
                <Button
                  key={i}
                  onClick={() => handleChangePage(i + 1)}
                  variant={currentPage === i + 1 ? "primary" : "default"}
                >
                  {i + 1}
                </Button>
              ))}
            <Button onClick={() => handleNextPage()}>Next</Button>
          </div>
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
    props: { posts, meta: data.posts.meta },
    revalidate: 60,
  };
};

export default Posts;
