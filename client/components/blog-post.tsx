import classNames from "classnames";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import { API_URL } from "../lib/apollo";
import { PostType } from "../lib/typings";
import contentToReadTime from "../utils/contentToReadTime";
import timestampToString from "../utils/timestampToString";
import Heading from "./atoms/heading";
import Paragraph from "./atoms/paragraph";

interface Props {
  className?: string;
  post: PostType;
}

const BlogPost: FC<Props> = ({ className, post }) => {
  const {
    attributes: { slug, title, content, cover, category, publishedAt },
  } = post;
  const {
    data: {
      attributes: { url, width, height, alternativeText },
    },
  } = cover;
  const {
    data: {
      attributes: { name, slug: categorySlug },
    },
  } = category;

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
          <Paragraph
            size="sm"
            color="light"
            className="flex flex-wrap gap-4 font-normal"
          >
            <span>{contentToReadTime(content)} min read</span>
            <span>{timestampToString(publishedAt)}</span>
            <Link href={`/categories/${categorySlug}`}>
              <a>{name}</a>
            </Link>
          </Paragraph>
          <Heading level={4}>{title}</Heading>
        </div>
      </a>
    </Link>
  );
};

export default BlogPost;
