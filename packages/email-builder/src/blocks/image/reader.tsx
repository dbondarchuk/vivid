import { ImageProps } from "./schema";
import { getImageStyles, getWrapperStyles } from "./styles";

export const Image = ({ style, props }: ImageProps) => {
  const sectionStyle = getWrapperStyles({ style });
  const imageStyle = getImageStyles({ props });

  const linkHref = props?.linkHref ?? null;
  const width = props?.width ?? undefined;
  const height = props?.height ?? undefined;

  const imageElement = (
    <img
      alt={props?.alt ?? ""}
      src={props?.url ?? ""}
      width={width}
      height={height}
      style={{
        width,
        height,
        ...imageStyle,
      }}
    />
  );

  if (!linkHref) {
    return <div style={sectionStyle}>{imageElement}</div>;
  }

  return (
    <div style={sectionStyle}>
      <a href={linkHref} style={{ textDecoration: "none" }} target="_blank">
        {imageElement}
      </a>
    </div>
  );
};
