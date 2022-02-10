import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import { API_URL } from "../lib/apollo";
import { AuthorType } from "../lib/typings";
import Heading from "./atoms/heading";
import Paragraph from "./atoms/paragraph";

interface Props {
  author: AuthorType;
}

const AuthorCard: FC<Props> = ({ author }) => {
  const {
    attributes: { name, slug, description, posts, avatar },
  } = author;
  const {
    data: {
      attributes: { url, alternativeText },
    },
  } = avatar;

  return (
    <Link href={`/authors/${slug}`}>
      <a className="flex gap-4 items-start bg-emerald-300 p-4">
        <span style={{ height: "64px" }}>
          <Image
            src={`${API_URL}${url}`}
            width={64}
            height={64}
            alt={alternativeText}
            objectFit="cover"
            layout="fixed"
          />
        </span>
        <div className="flex flex-col gap-4">
          <Heading level={4}>{name}</Heading>
          <Paragraph size="sm" className="uppercase">
            {posts.data.length} post{posts.data.length !== 1 && "s"}
          </Paragraph>
        </div>
      </a>
    </Link>
  );
};

export default AuthorCard;
