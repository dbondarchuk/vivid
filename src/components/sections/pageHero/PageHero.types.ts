import { Section } from "@/types/section";

export type PageHeroSection = Section & {
  title: string;
  subtitle?: string;
  description?: string;
  backgroundImage?: string;
  cta?: {
    link: string;
    text: string;
  };
};
