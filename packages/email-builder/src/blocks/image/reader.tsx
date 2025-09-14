import { Image } from "./image";
import { ImageProps } from "./schema";

export const ImageReader = (props: ImageProps) => {
  return <Image {...props} />;
};
