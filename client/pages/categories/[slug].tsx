import { gql } from "@apollo/client";
import {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
  NextPage,
} from "next";
import Image from "next/image";
import Link from "next/link";
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
    <div>
      <Image
        src={`${API_URL}${url}`}
        width={width}
        height={height}
        alt={alternativeText}
      />
      <h1>{name}</h1>
      <pre>{description}</pre>
      <div>
        {posts.data.map(({ id, attributes: { title, slug } }) => (
          <Link key={id} href={`/posts/${slug}`}>
            <a>{title}</a>
          </Link>
        ))}
      </div>
    </div>
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

  return {
    props: {
      category,
    },
    revalidate: 60,
  };
};

export default Category;
