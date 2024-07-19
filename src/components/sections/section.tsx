import { Section as SectionProps } from "@/types/section";
import React from "react";
import { GallerySection } from "./gallery/GallerySection";
import { GridSection } from "./grid/Grid";
import { PageHeroSection } from "./pageHero/PageHero";
import { TextSection } from "./text/Text";

export const sectionTypes = {
  pageHero: PageHeroSection,
  gallery: GallerySection,
  grid: GridSection,
  text: TextSection,
};

export const Section: React.FC<SectionProps> = (props) => {
  const Component = sectionTypes[props.type];
  if (!Component) return null;

  // @ts-ignore Dynamic component
  return <Component {...props} />;
};
