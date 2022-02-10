import classNames from "classnames";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import { API_URL } from "../lib/apollo";
import { PostType } from "../lib/typings";
import Heading from "./atoms/heading";

interface Props {
  className?: string;
  post: PostType;
}

const BlogPost: FC<Props> = ({ className, post }) => {
  const {
    attributes: { slug, title, content, cover },
  } = post;
  const {
    data: {
      attributes: { url, width, height, alternativeText },
    },
  } = cover;

  return (
    <Link href={`/posts/${slug}`}>
      <a className={classNames("p-4 bg-yellow-300", className)}>
        <div className="flex flex-col gap-4">
          <Image
            src={`${API_URL}${url}`}
            width={1200}
            height={740}
            objectFit="cover"
            alt={alternativeText}
          />
          <Heading level={3}>{title}</Heading>
        </div>
      </a>
    </Link>
  );
};

export default BlogPost;
