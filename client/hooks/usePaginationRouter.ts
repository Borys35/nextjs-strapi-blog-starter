import { useRouter } from "next/router";

interface PushProps {
  sortOpt?: string;
  pageNum?: number | string;
}

function usePaginationRouter() {
  const router = useRouter();

  const push = ({ sortOpt, pageNum }: PushProps) => {
    const { slug, sort, page } = router.query;

    const query = {} as any;
    if (slug) query.slug = slug;
    if (sort) query.sort = sort;
    if (pageNum) query.page = pageNum;
    if (sortOpt) query.sort = sortOpt;

    router.push({ query }, undefined, { shallow: true });
  };

  return { push, query: router.query };
}

export default usePaginationRouter;
