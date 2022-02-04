import { FC } from "react";

interface Props {
  level: 1 | 2 | 3 | 4 | 5 | 6;
}

const Heading: FC<Props> = ({ children, level }) => {
  const LevelHeading = `h${level}` as const;

  return <LevelHeading>{children}</LevelHeading>;
};

export default Heading;
