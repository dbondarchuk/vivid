"use client";

import { cn } from "@/lib/utils";
import React from "react";

export const HeaderWithScrollShadow: React.FC<{
  children: React.ReactElement;
}> = ({ children }) => {
  const [top, setTop] = React.useState(true);

  React.useEffect(() => {
    const scrollHandler = () => {
      window.scrollY > 10 ? setTop(false) : setTop(true);
    };
    window.addEventListener("scroll", scrollHandler);
    return () => window.removeEventListener("scroll", scrollHandler);
  }, [top]);

  const clone = React.cloneElement(children, {
    ...children.props,
    className: cn(children.props?.className, !top ? "drop-shadow-md" : ""),
  });

  return clone;
};
