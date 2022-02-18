import { useLazyQuery } from "@apollo/client";
import classNames from "classnames";
import { DocumentNode } from "graphql";
import { FC, useEffect } from "react";
import usePaginationRouter from "../../hooks/usePaginationRouter";
import { PostType } from "../../lib/typings";
import BlogPost from "../blog-post";

interface Props {
  staticPosts: PostType[];
  getPostsQuery: DocumentNode;
  pageCount: number;
  className?: string;
}

const PostsGrid: FC<Props> = ({
  staticPosts,
  getPostsQuery,
  pageCount,
  className,
}) => {
  const { push, query } = usePaginationRouter();
  const [loadPosts, { data }] = useLazyQuery(getPostsQuery);

  useEffect(() => {
    const { sort, page } = query;

    let pageNum = parseInt(page as string);

    if (pageNum < 1 || pageNum > pageCount) {
      if (pageNum < 1) pageNum = 1;
      else if (pageNum > pageCount) pageNum = pageCount;

      push({ pageNum });
    } else {
      let sortOpt;
      if (sort === "latest") sortOpt = "publishedAt:desc";
      else if (sort === "oldest") sortOpt = "publishedAt:asc";
      else if (sort === "alphabetically") sortOpt = "title:asc";
      else sortOpt = "publishedAt:desc";

      const variables = { sort: sortOpt, page: pageNum } as any;
      if (query.slug) variables.slug = query.slug;

      loadPosts({ variables });
    }
  }, [query]);

  const rightPosts: PostType[] = data ? data.posts.data : staticPosts;

  return (
    <section
      className={classNames(
        "grid gap-8 grid-cols-1 md:grid-cols-2 xl:grid-cols-3",
        className
      )}
    >
      {rightPosts.map((post) => (
        <BlogPost key={post.id} post={post} />
      ))}
    </section>
  );
};

export default PostsGrid;
