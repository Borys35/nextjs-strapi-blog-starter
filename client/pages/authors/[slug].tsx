import { gql } from "@apollo/client";
import {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
  NextPage,
} from "next";
import Image from "next/image";
import Container from "../../components/atoms/container";
import Heading from "../../components/atoms/heading";
import Paragraph from "../../components/atoms/paragraph";
import Layout from "../../components/layout";
import PostsGrid from "../../components/pagination/pages-grid";
import PostsPages from "../../components/pagination/posts-pages";
import PostsSelect from "../../components/pagination/posts-select";
import { API_URL, apolloClient } from "../../lib/apollo";
import { AuthorType, MetaType, PostType } from "../../lib/typings";

const GET_ALL_AUTHOR_SLUGS = gql`
  {
    authors {
      data {
        attributes {
          slug
        }
      }
    }
  }
`;
const GET_AUTHOR = gql`
  query GetAuthor($slug: String!) {
    authors(filters: { slug: { eq: $slug } }) {
      data {
        id
        attributes {
          name
          slug
          description
          posts {
            data {
              attributes {
                title
                content
                slug
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
                      alternativeText
                    }
                  }
                }
              }
            }
          }
          avatar {
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
      filters: { author: { slug: { eq: $slug } } }
    ) {
      data {
        id
        attributes {
          slug
          title
          content
          publishedAt
          author {
            data {
              attributes {
                slug
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
  author: AuthorType;
  posts: PostType[];
  meta: MetaType;
}

const author: NextPage<Props> = ({ author, posts, meta }) => {
  const {
    attributes: { name, description, slug, avatar },
  } = author;
  const { url, width, height, alternativeText } = avatar.data.attributes;
  const { pageCount } = meta.pagination;

  return (
    <Layout title={name} description={description}>
      <div className="flex flex-col gap-16 my-16">
        <Container>
          <header className="w-full flex flex-col sm:flex-row gap-8 sm:items-start col-start-1 col-end-13">
            <div
              className="aspect-square relative"
              style={{ minWidth: "192px" }}
            >
              <Image
                src={`${API_URL}${url}`}
                width={192}
                height={192}
                alt={alternativeText}
                objectFit="cover"
                layout="fill"
                priority
              />
            </div>

            <div className="flex flex-col gap-4">
              <Heading level={2}>{name}</Heading>
              <Paragraph>{description}</Paragraph>
            </div>
          </header>
        </Container>

        <section>
          <Container>
            <div className="flex flex-col gap-8 col-start-1 col-end-13">
              <div className="flex items-end justify-between">
                <Heading level={2}>
                  {posts.length} post{posts.length !== 1 && "s"}
                </Heading>
                <PostsSelect />
              </div>
              <PostsGrid
                staticPosts={posts}
                getPostsQuery={GET_ALL_POSTS}
                pageCount={pageCount}
              />
              {pageCount >= 1 && <PostsPages pageCount={pageCount} />}
            </div>
          </Container>
        </section>
      </div>
    </Layout>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const { data } = await apolloClient.query({ query: GET_ALL_AUTHOR_SLUGS });

  const authors: Pick<AuthorType, "attributes">[] = data.authors.data;
  const paths = authors.map(({ attributes: { slug } }) => ({
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
  const { slug } = ctx.params as { slug: string };
  const { data } = await apolloClient.query({
    query: GET_AUTHOR,
    variables: { slug },
  });
  const [author] = data.authors.data as AuthorType[];

  const { data: postsData } = await apolloClient.query({
    query: GET_ALL_POSTS,
    variables: { slug },
  });

  return {
    props: {
      author,
      posts: postsData.posts.data,
      meta: postsData.posts.meta,
    },
    revalidate: 60,
  };
};

export default author;
