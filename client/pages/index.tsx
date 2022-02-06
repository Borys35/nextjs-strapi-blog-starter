import { ApolloError, gql } from "@apollo/client";
import type { GetStaticProps, NextPage } from "next";
import Button from "../components/atoms/button";
import Container from "../components/atoms/container";
import Heading from "../components/atoms/heading";
import Paragraph from "../components/atoms/paragraph";
import BlogPost from "../components/blog-post";
import CategoryCard from "../components/category-card";
import Field from "../components/field";
import Layout from "../components/layout";
import { apolloClient } from "../lib/apollo";
import { CategoryType, PostType } from "../lib/typings";

const ALL_POST_QUERY = gql`
  {
    posts {
      data {
        id
        attributes {
          title
          publishedAt
          slug
          author {
            data {
              attributes {
                name
                avatar {
                  data {
                    attributes {
                      url
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
    categories {
      data {
        id
        attributes {
          name
          slug
          cover {
            data {
              attributes {
                url
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
  categories: CategoryType[];
  error: ApolloError;
}

const Home: NextPage<Props> = ({ posts, categories, error }) => {
  if (error) return <div>{error.message}</div>;

  return (
    <Layout title="Home" description="Welcome to the Blog">
      <div className="flex flex-col gap-24 mb-24">
        <header className="py-24">
          <Container>
            <Heading
              level={1}
              className="col-start-1 col-end-13 md:col-start-2 md:col-end-6"
            >
              Blog Starter
            </Heading>
            <div className="col-start-1 col-end-3 md:col-start-2 md:col-end-4">
              Socials
            </div>
            <div className="col-start-3 col-end-13 md:col-start-4 md:col-end-8">
              <Paragraph>
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Minus
                eum ratione doloribus eos mollitia rem harum cupiditate corporis
                expedita tempora.
              </Paragraph>
            </div>
          </Container>
        </header>
        <section>
          <Container>
            <Heading level={2} className="col-start-1 col-end-13 mb-8">
              My Pick
            </Heading>
            <div className="grid gap-8 md:grid-cols-3 md:grid-rows-6 col-start-1 col-end-13">
              <BlogPost
                post={posts[0]}
                className="md:col-start-1 md:col-end-3 md:row-start-1 md:row-end-4"
              />
              <BlogPost
                post={posts[1]}
                className="md:col-start-3 md:col-end-4 md:row-start-1 md:row-end-3"
              />
              <BlogPost
                post={posts[2]}
                className="md:col-start-3 md:col-end-4 md:row-start-3 md:row-end-5"
              />
              <BlogPost
                post={posts[0]}
                className="md:col-start-1 md:col-end-3 md:row-start-4 md:row-end-7"
              />
              <BlogPost
                post={posts[1]}
                className="md:col-start-3 md:col-end-4 md:row-start-5 md:row-end-7"
              />
            </div>
          </Container>
        </section>

        <section>
          <Container>
            <Heading level={2} className="col-start-1 col-end-13 mb-8">
              Latest
            </Heading>
            <div className="grid gap-8 md:grid-cols-2 col-start-1 col-end-13">
              <BlogPost post={posts[0]} />
              <BlogPost post={posts[1]} />
              <BlogPost post={posts[2]} />
              <BlogPost post={posts[0]} />
              <BlogPost post={posts[2]} />
              <BlogPost post={posts[0]} />
              <div className="grid md:grid-cols-3 gap-8 md:col-start-1 md:col-end-3 row-start-3 row-end-4 py-16">
                <CategoryCard category={categories[0]} />
                <CategoryCard category={categories[1]} />
                <CategoryCard category={categories[2]} />
                <CategoryCard category={categories[3]} />
              </div>
            </div>
          </Container>
        </section>

        <section>
          <Container>
            <div className="col-start-1 col-end-13">
              <Heading level={1}>Interested in blog?</Heading>
              <Paragraph size="lg" className="mb-8">
                Subsribe to my newsletter and get all blog posts as fast as you
                can!
              </Paragraph>
              <form
                onSubmit={(e) => e.preventDefault()}
                className="flex items-end"
              >
                <Field
                  label="Your e-mail"
                  inputProps={{ placeholder: "example@mail.com" }}
                />
                <Button size="lg" variant="primary" className="-ml-2">
                  Subscribe
                </Button>
              </form>
            </div>
          </Container>
        </section>
      </div>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const { data, error } = await apolloClient.query({ query: ALL_POST_QUERY });

  if (error)
    return {
      props: { error },
    };

  return {
    props: { posts: data.posts.data, categories: data.categories.data },
    revalidate: 30,
  };
};

export default Home;
