import { FC } from "react";
import usePaginationRouter from "../../hooks/usePaginationRouter";
import Select from "../atoms/select";

interface Props {
  className?: string;
}

const PostsSelect: FC<Props> = ({ className }) => {
  const { push } = usePaginationRouter();

  function handleChange(e: any) {
    push({ sortOpt: e.target.value });
  }

  return (
    <Select onChange={handleChange} className={className}>
      <option value="latest">Latest</option>
      <option value="oldest">Oldest</option>
      <option value="alphabetically">Alphabetically</option>
    </Select>
  );
};

export default PostsSelect;
