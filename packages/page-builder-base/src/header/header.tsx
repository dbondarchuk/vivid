"use client";
import { PageHeader } from "@hacado/types";
import { cn } from "@hacado/ui";
import { ReactNode, useEffect, useState } from "react";

export const HeaderInternal = ({
  config,
  className,
  headerId,
  children,
}: {
  config: PageHeader;
  className?: string;
  headerId?: string;
  children: ReactNode | ReactNode[];
}) => {
  const [topOffset, setTopOffset] = useState(false);
  useEffect(() => {
    const scrollHandler = () => {
      setTopOffset(window.scrollY <= 10);
    };
    scrollHandler();
    window.addEventListener("scroll", scrollHandler, { passive: true });
    return () => window.removeEventListener("scroll", scrollHandler);
  }, []);

  return (
    <header
      className={cn(
        "font-light text-[hsl(var(--value-foreground-color))] font-[family-name:--font-primary-value] w-full z-20 transition-all duration-300 header-container",
        config?.sticky && config?.backdropBlur
          ? "bg-[hsl(var(--value-background-color)/0.9)] backdrop-blur"
          : "bg-[hsl(var(--value-background-color))]",
        config?.sticky && "sticky top-0",
        config?.shadow === "static" && "drop-shadow-md",
        config?.shadow === "on-scroll" && topOffset && "drop-shadow-md",
        headerId && `header-${headerId}-container`,
        className,
      )}
      data-header-id={headerId}
    >
      {children}
    </header>
  );
};
