import { ImageProps } from "next/image";

export type GalleryImageProps = ImageProps;

export type GalleryProps = React.HTMLAttributes<HTMLDivElement> & {
  basis?: number;
  title?: string;
  children:
    | React.ReactElement<GalleryImageProps>
    | React.ReactElement<GalleryImageProps>[];
};
