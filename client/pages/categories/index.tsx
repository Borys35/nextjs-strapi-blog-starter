import { gql } from "@apollo/client";
import { GetStaticProps, NextPage } from "next";
import Link from "next/link";
import { apolloClient } from "../../lib/apollo";
import { CategoryType } from "../../lib/typings";

const GET_ALL_CATEGORIES = gql`
  {
    categories {
      data {
        id
        attributes {
          name
          slug
        }
      }
    }
  }
`;

interface Props {
  categories: CategoryType[];
}

const Categories: NextPage<Props> = ({ categories }) => {
  return (
    <div className="flex flex-col gap-6">
      {categories.map(({ id, attributes: { name, slug } }) => (
        <Link key={id} href={`/categories/${slug}`}>
          <a>{name}</a>
        </Link>
      ))}
    </div>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await apolloClient.query({ query: GET_ALL_CATEGORIES });

  const categories: CategoryType[] = data.categories.data;

  return {
    props: { categories },
    revalidate: 60,
  };
};

export default Categories;
