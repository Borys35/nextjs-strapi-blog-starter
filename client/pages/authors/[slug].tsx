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
import BlogPost from "../../components/blog-post";
import Layout from "../../components/layout";
import { API_URL, apolloClient } from "../../lib/apollo";
import { AuthorType } from "../../lib/typings";

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

interface Props {
  author: AuthorType;
}

const author: NextPage<Props> = ({ author }) => {
  const {
    attributes: { name, description, slug, avatar, posts },
  } = author;
  const { url, width, height, alternativeText } = avatar.data.attributes;
  console.log(description, "desc");

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
            <Heading level={2} className="mb-4 col-start-1 col-end-13">
              {posts.data.length} post{posts.data.length !== 1 && "s"}
            </Heading>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 col-start-1 col-end-13">
              {posts.data.map((post) => (
                <BlogPost key={post.id} post={post} />
              ))}
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

  return {
    props: {
      author,
    },
    revalidate: 60,
  };
};

export default author;
