import { gql } from "@apollo/client";
import { GetStaticProps, NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { API_URL, apolloClient } from "../../lib/apollo";
import { AuthorType } from "../../lib/typings";

const GET_ALL_AUTHORS = gql`
  {
    authors {
      data {
        id
        attributes {
          name
          slug
          avatar {
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
  }
`;

interface Props {
  authors: AuthorType[];
}

const Authors: NextPage<Props> = ({ authors }) => {
  return (
    <div className="flex flex-col gap-6">
      {authors.map(({ id, attributes: { name, slug, avatar } }) => (
        <div>
          <Image
            src={`${API_URL}${avatar.data.attributes.url}`}
            width={48}
            height={48}
            className="rounded-full"
          />
          <Link key={id} href={`/authors/${slug}`}>
            <a>{name}</a>
          </Link>
        </div>
      ))}
    </div>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await apolloClient.query({ query: GET_ALL_AUTHORS });

  const authors: AuthorType[] = data.authors.data;

  return {
    props: { authors },
    revalidate: 60,
  };
};

export default Authors;
