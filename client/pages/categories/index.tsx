import { gql } from "@apollo/client";
import { GetStaticProps, NextPage } from "next";
import Container from "../../components/atoms/container";
import Heading from "../../components/atoms/heading";
import CategoryCard from "../../components/category-card";
import Layout from "../../components/layout";
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
    <Layout
      title="Categories"
      description="Check out all topics we write about"
    >
      <div className="my-24">
        <Container>
          <Heading level={1} className="mb-4">
            Categories
          </Heading>
          <section className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 col-start-1 col-end-13">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </section>
        </Container>
      </div>
    </Layout>
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
