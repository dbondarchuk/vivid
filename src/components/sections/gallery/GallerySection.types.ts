import { Section } from "@/types/section";
import { ImageProps } from "next/image";

export type GallerySectionImage = {
  src: string;
  alt: string;
};

export type GallerySection = Section & {
  basis?: number;
  title: string;
  images: GallerySectionImage[];
};

export type GalleryImageProps = ImageProps;

export type GalleryProps = React.HTMLAttributes<HTMLDivElement> & {
  basis?: number;
  title?: string;
  children:
    | React.ReactElement<GalleryImageProps>
    | React.ReactElement<GalleryImageProps>[];
};
