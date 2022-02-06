import Link from "next/link";
import { FC } from "react";
import { CategoryType } from "../lib/typings";
import Heading from "./atoms/heading";

interface Props {
  category: CategoryType;
}

const CategoryCard: FC<Props> = ({ category }) => {
  const {
    attributes: { name, slug },
  } = category;

  return (
    <Link href={`/categories/${slug}`}>
      <a className="p-4 bg-blue-500">
        <Heading level={3}>{name}</Heading>
      </a>
    </Link>
  );
};

export default CategoryCard;
