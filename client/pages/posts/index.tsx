import { gql } from "@apollo/client";
import { GetStaticProps, NextPage } from "next";
import Container from "../../components/atoms/container";
import Heading from "../../components/atoms/heading";
import Layout from "../../components/layout";
import PostsGrid from "../../components/pagination/pages-grid";
import PostsPages from "../../components/pagination/posts-pages";
import PostsSelect from "../../components/pagination/posts-select";
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
  const { pageCount } = meta.pagination;

  return (
    <Layout
      title="Posts"
      description="There are all posts we have ever published to you!"
    >
      <div className="my-24">
        <Container>
          <div className="flex flex-col gap-8 col-start-1 col-end-13">
            <div className="flex items-end justify-between">
              <Heading level={1}>Posts</Heading>
              {/* Select part */}
              <PostsSelect />
            </div>
            {/* Main part */}
            <PostsGrid
              staticPosts={posts}
              getPostsQuery={GET_ALL_POSTS}
              pageCount={pageCount}
              className="col-start-1 col-end-13"
            />
            {/* Pagination part */}
            <PostsPages
              pageCount={pageCount}
              className="col-start-1 col-end-13"
            />
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
