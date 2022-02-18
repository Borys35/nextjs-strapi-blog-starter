import classNames from "classnames";
import { FC } from "react";
import usePaginationRouter from "../../hooks/usePaginationRouter";
import Button from "../atoms/button";

interface Props {
  pageCount: number;
  className?: string;
}

const PostsPages: FC<Props> = ({ pageCount, className }) => {
  const { push, query } = usePaginationRouter();

  function handleChangePage(page: number) {
    push({ pageNum: page });
  }

  function handleNextPage() {
    const { page } = query;
    if (!page) return push({ pageNum: 2 });

    const pageNum = parseInt(page as string) + 1;
    if (pageNum > pageCount) return;

    push({ pageNum });
  }

  function handlePrevPage() {
    const { page } = query;
    if (!page) return;

    const pageNum = parseInt(page as string) - 1;
    if (pageNum <= 0) return;

    push({ pageNum });
  }

  const currentPage = query.page ? parseInt(query.page as string) : 1;

  return (
    <div className={classNames("flex justify-center gap-1", className)}>
      <Button onClick={() => handlePrevPage()}>Prev</Button>
      {Array(pageCount)
        .fill(null)
        .map((_, i) => (
          <Button
            key={i}
            onClick={() => handleChangePage(i + 1)}
            variant={currentPage === i + 1 ? "primary" : "default"}
          >
            {i + 1}
          </Button>
        ))}
      <Button onClick={() => handleNextPage()}>Next</Button>
    </div>
  );
};

export default PostsPages;
