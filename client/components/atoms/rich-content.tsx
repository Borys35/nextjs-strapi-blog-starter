import classNames from "classnames";
import { FC } from "react";

interface Props {
  html: string;
  className?: string;
}

const RichContent: FC<Props> = ({ html, className }) => {
  return (
    <div
      className={classNames("leading-loose text-lg", className)}
      dangerouslySetInnerHTML={{ __html: html }}
    ></div>
  );
};

export default RichContent;
