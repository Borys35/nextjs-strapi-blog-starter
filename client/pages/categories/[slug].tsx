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
import BlogPost from "../../components/blog-post";
import Layout from "../../components/layout";
import { API_URL, apolloClient } from "../../lib/apollo";
import { CategoryType } from "../../lib/typings";

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

interface Props {
  category: CategoryType;
}

const Category: NextPage<Props> = ({ category }) => {
  const {
    attributes: { name, description, posts, cover },
  } = category;
  const { url, width, height, alternativeText } = cover.data.attributes;

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
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.data.map((post) => (
                <BlogPost key={post.id} post={post} />
              ))}
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

  return {
    props: {
      category: newCategory,
    },
    revalidate: 60,
  };
};

export default Category;
