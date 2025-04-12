import { ButtonVariant } from "@vivid/ui";
import type { CSSProperties, HTMLAttributes } from "react";

export type PageHeroSection = HTMLAttributes<HTMLDivElement> & {
  title: string;
  subtitle?: string;
  description?: string;
  backgroundImage?: string;
  cta?: {
    link: string;
    text: string;
    variant?: ButtonVariant;
    className?: string;
  }[];
  className?: string;
  style?: CSSProperties;
  variant?: "background" | "imageRight" | "imageLeft";
};
