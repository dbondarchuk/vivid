import React from "react";
import { Link } from "./link";

type HeadingProps = {
  title: string;
  description?: string;
  href?: string;
};

export const Heading: React.FC<HeadingProps> = ({
  title,
  description,
  href,
}) => {
  return (
    <div>
      <h2 className="text-2xl font-bold tracking-tight">
        {href ? <Link href={href}>{title}</Link> : title}
      </h2>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  );
};
