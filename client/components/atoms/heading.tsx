import { FC } from "react";

interface Props {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
}

const Heading: FC<Props> = ({ children, level, className }) => {
  const LevelHeading = `h${level}` as const;

  return <LevelHeading className={className}>{children}</LevelHeading>;
};

export default Heading;
