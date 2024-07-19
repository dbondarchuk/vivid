import React from "react";

export const Block: React.FC<React.HtmlHTMLAttributes<HTMLDivElement>> = ({
  children,
  ...props
}) => {
  return <div {...props}>{children}</div>;
};
