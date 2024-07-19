import { GallerySection } from "@/components/sections/gallery/GallerySection.types";
import { PageHeroSection } from "@/components/sections/pageHero/PageHero.types";
import { ServicesSection } from "@/components/sections/services/ServicesSection.types";

export type HomePageSections =
  | ({ type: "pageHero" } & PageHeroSection)
  | ({ type: "gallery" } & GallerySection)
  | ({ type: "services" } & ServicesSection);

export type HomePageConfig = {
  sections: HomePageSections[];
};
