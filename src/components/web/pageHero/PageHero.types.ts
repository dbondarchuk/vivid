import type { HTMLAttributes } from "react";

export type PageHeroSection = HTMLAttributes<HTMLDivElement> & {
  title: string;
  subtitle?: string;
  description?: string;
  backgroundImage?: string;
  cta?: {
    link: string;
    text: string;
  };
  className?: string;
};
