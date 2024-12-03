import { ImageProps } from "next/image";

export type GalleryImageProps = ImageProps;

export type GalleryItemPosition = "start" | "end" | "center" | "stretch";

export type GalleryProps = React.HTMLAttributes<HTMLDivElement> & {
  basis?: number;
  title?: string;
  children:
    | React.ReactElement<GalleryImageProps>
    | React.ReactElement<GalleryImageProps>[];
  itemsPos?: GalleryItemPosition;
  itemClassName?: string;
};
