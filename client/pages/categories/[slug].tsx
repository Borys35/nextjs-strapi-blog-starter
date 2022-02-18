import { gql } from "@apollo/client";
import {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
  NextPage,
} from "next";
import Image from "next/image";
import { remark } from "remark";
import html from "remark-html";
import sanitize from "sanitize-html";
import Container from "../../components/atoms/container";
import Layout from "../../components/layout";
import PostsGrid from "../../components/pagination/pages-grid";
import PostsPages from "../../components/pagination/posts-pages";
import PostsSelect from "../../components/pagination/posts-select";
import { API_URL, apolloClient } from "../../lib/apollo";
import { CategoryType, MetaType, PostType } from "../../lib/typings";

const GET_ALL_CATEGORY_SLUGS = gql`
  {
    categories {
      data {
        attributes {
          slug
        }
      }
    }
  }
`;
const GET_CATEGORY = gql`
  query GetCategory($slug: String!) {
    categories(filters: { slug: { eq: $slug } }) {
      data {
        id
        attributes {
          name
          description
          posts {
            data {
              id
              attributes {
                title
                slug
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
const GET_ALL_POSTS = gql`
  query GetPosts($sort: [String], $page: Int, $slug: String!) {
    posts(
      sort: $sort
      pagination: { page: $page, pageSize: 6 }
      filters: { category: { slug: { eq: $slug } } }
    ) {
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
  category: CategoryType;
  posts: PostType[];
  meta: MetaType;
}

const Category: NextPage<Props> = ({ category, posts, meta }) => {
  const {
    attributes: { name, description, cover },
  } = category;
  const { url, width, height, alternativeText } = cover.data.attributes;
  const { pageCount } = meta.pagination;

  return (
    <Layout title={name} description={description}>
      <div>
        <div className="h-96 overflow-hidden">
          <Image
            src={`${API_URL}${url}`}
            width={width}
            height={height}
            alt={alternativeText}
            priority
          />
        </div>
        <Container>
          <div className="col-start-1 col-end-13 flex flex-col gap-16 mt-8 mb-16">
            <div>
              <h1>{name}</h1>
              <div dangerouslySetInnerHTML={{ __html: description }}></div>
            </div>
            <div className="flex flex-col gap-8 col-start-1 col-end-13">
              <PostsSelect className="self-end" />
              <PostsGrid
                staticPosts={posts}
                getPostsQuery={GET_ALL_POSTS}
                pageCount={pageCount}
              />
              {pageCount > 1 && <PostsPages pageCount={pageCount} />}
            </div>
          </div>
        </Container>
      </div>
    </Layout>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const { data } = await apolloClient.query({ query: GET_ALL_CATEGORY_SLUGS });

  const categories: Pick<CategoryType, "attributes">[] = data.categories.data;
  const paths = categories.map(({ attributes: { slug } }) => ({
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
  // Fetching category without posts

  const { slug } = ctx.params as { slug: string };
  const { data } = await apolloClient.query({
    query: GET_CATEGORY,
    variables: { slug },
  });
  const [category] = data.categories.data as CategoryType[];
  const processed = await remark()
    .use(html)
    .process(category.attributes.description);
  const newCategory = { ...category };
  newCategory.attributes = {
    ...newCategory.attributes,
    description: sanitize(processed.toString()),
  };

  // Fetching posts separately for pagination

  const { data: postsData } = await apolloClient.query({
    query: GET_ALL_POSTS,
    variables: { slug },
  });

  // Returning data

  return {
    props: {
      category: newCategory,
      posts: postsData.posts.data,
      meta: postsData.posts.meta,
    },
    revalidate: 60,
  };
};

export default Category;
