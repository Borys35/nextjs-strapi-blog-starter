import { ApolloError, gql } from "@apollo/client";
import type { GetStaticProps, NextPage } from "next";
import Image from "next/image";
import Container from "../components/atoms/container";
import Heading from "../components/atoms/heading";
import Paragraph from "../components/atoms/paragraph";
import BlogPost from "../components/blog-post";
import CategoryCard from "../components/category-card";
import Layout from "../components/layout";
import NewsletterForm from "../components/newsletter-form";
import Socials from "../components/socials";
import { API_URL, apolloClient } from "../lib/apollo";
import { CategoryType, HomeType, PostType } from "../lib/typings";
import { useGlobal } from "../providers/GlobalProvider";

const GET_HOME_ATTRIBUTES = gql`
  {
    home {
      data {
        attributes {
          heading
          subheading
          newsletterHeading
          newsletterSubheading
          mainImage {
            data {
              attributes {
                url
                width
                height
                alternativeText
              }
            }
          }
          featuredPosts(pagination: { pageSize: 5 }) {
            data {
              id
              attributes {
                title
                slug
                publishedAt
                content
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
                author {
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
      }
    }
    posts(pagination: { pageSize: 8 }, sort: "publishedAt:desc") {
      data {
        id
        attributes {
          title
          content
          publishedAt
          slug
          category {
            data {
              attributes {
                name
                slug
              }
            }
          }
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
  home: HomeType;
  posts: PostType[];
  categories: CategoryType[];
  error: ApolloError;
}

const Home: NextPage<Props> = ({ home, posts, categories, error }) => {
  if (error) return <div>{error.message}</div>;

  const {
    attributes: { socials },
  } = useGlobal();
  const {
    heading,
    subheading,
    newsletterHeading,
    newsletterSubheading,
    mainImage,
    featuredPosts,
  } = home.attributes;
  const { url, width, height, alternativeText } = mainImage.data.attributes;

  return (
    <Layout title="Home" description="Welcome to the Blog">
      <div className="flex flex-col gap-24 mb-24">
        <header className="pt-24">
          <Container>
            <Heading
              level={1}
              className="mb-6 col-start-1 col-end-13 md:col-start-2 md:col-end-6"
            >
              {heading}
            </Heading>
            <div className="flex flex-col flex-wrap lg:h-16 gap-4 col-start-1 col-end-3 md:col-start-2 md:col-end-3">
              <Socials socials={socials} />
            </div>
            <div className="col-start-3 col-end-13 md:col-start-3 md:col-end-6">
              <Paragraph>{subheading}</Paragraph>
            </div>
            <div className="hidden md:col-start-7 md:col-end-12 md:row-start-1 md:row-end-3 md:grid md:place-items-center">
              <Image
                src={`${API_URL}${url}`}
                width={width}
                height={height}
                alt={alternativeText}
              />
            </div>
          </Container>
        </header>
        {featuredPosts.data.length >= 5 && (
          <section>
            <Container>
              <Heading level={2} className="col-start-1 col-end-13 mb-8">
                My Pick
              </Heading>
              <div className="grid gap-8 lg:grid-cols-3 lg:grid-rows-6 col-start-1 col-end-13">
                <BlogPost
                  post={featuredPosts.data[0]}
                  className="lg:col-start-1 lg:col-end-3 lg:row-start-1 lg:row-end-4"
                />
                <BlogPost
                  post={featuredPosts.data[1]}
                  className="lg:col-start-3 lg:col-end-4 lg:row-start-1 lg:row-end-3"
                />
                <BlogPost
                  post={featuredPosts.data[2]}
                  className="lg:col-start-3 lg:col-end-4 lg:row-start-3 lg:row-end-5"
                />
                <BlogPost
                  post={featuredPosts.data[3]}
                  className="lg:col-start-1 lg:col-end-3 lg:row-start-4 lg:row-end-7"
                />
                <BlogPost
                  post={featuredPosts.data[4]}
                  className="lg:col-start-3 lg:col-end-4 lg:row-start-5 lg:row-end-7"
                />
              </div>
            </Container>
          </section>
        )}

        <section>
          <Container>
            <Heading level={2} className="col-start-1 col-end-13 mb-8">
              Latest
            </Heading>
            <div className="grid gap-8 md:grid-cols-2 col-start-1 col-end-13">
              {posts.map((post) => (
                <BlogPost key={post.id} post={post} />
              ))}
              <div className="grid md:grid-cols-3 gap-8 md:col-start-1 md:col-end-3 row-start-3 row-end-4 py-16">
                {categories.map((category) => (
                  <CategoryCard key={category.id} category={category} />
                ))}
              </div>
            </div>
          </Container>
        </section>

        <section>
          <Container>
            <div className="col-start-1 col-end-13">
              <Heading level={1}>{newsletterHeading}</Heading>
              <Paragraph size="lg" className="mb-8">
                {newsletterSubheading}
              </Paragraph>
              <NewsletterForm />
            </div>
          </Container>
        </section>
      </div>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const { data, error } = await apolloClient.query({
    query: GET_HOME_ATTRIBUTES,
  });

  if (error)
    return {
      props: { error },
    };

  return {
    props: {
      home: data.home.data,
      posts: data.posts.data,
      categories: data.categories.data,
    },
    revalidate: 30,
  };
};

export default Home;
