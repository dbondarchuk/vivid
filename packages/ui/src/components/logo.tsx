import { cn } from "../utils";
import Link from "next/link";
import React from "react";

export const Logo: React.FC<{
  showLogo?: boolean;
  logo?: string;
  name: string;
  className?: string;
  imageClassName?: string;
}> = ({ logo, showLogo, name, className, imageClassName }) => {
  return (
    <Link
      href="/"
      className={cn(
        "flex title-font font-medium items-center gap-2",
        className
      )}
    >
      {logo && showLogo && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className={cn("relative max-h-8 object-contain", imageClassName)}
          src={logo}
          alt={name}
        />
      )}
      <span className="ml-3 text-xl font-primary font-medium">{name}</span>
    </Link>
  );
};
