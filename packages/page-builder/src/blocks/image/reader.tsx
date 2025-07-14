import { generateClassName } from "../../helpers/class-name-generator";
import { BlockStyle } from "../../helpers/styling";
import { ImageProps } from "./schema";
import { getDefaults, styles } from "./styles";

export const Image = ({ style, props }: ImageProps) => {
  const linkHref = props?.linkHref;

  const className = generateClassName();
  const imageElement = (
    <img alt={props?.alt ?? ""} src={props?.src ?? ""} className={className} />
  );

  const element = !linkHref ? (
    imageElement
  ) : (
    <a href={linkHref} style={{ textDecoration: "none", display: "block" }}>
      {imageElement}
    </a>
  );

  const defaults = getDefaults({ props, style }, false);

  return (
    <>
      <BlockStyle
        name={className}
        styleDefinitions={styles}
        styles={style}
        defaults={defaults}
        isEditor={false}
      />
      {element}
    </>
  );
};
