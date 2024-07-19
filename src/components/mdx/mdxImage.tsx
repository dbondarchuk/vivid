import Image, { ImageProps } from "next/image";

export const MdxImage: React.FC<ImageProps> = (props) => {
  return <Image {...props} alt={props.alt} />;
};
