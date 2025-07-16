import { cn } from "@vivid/ui";
import { generateClassName } from "../../helpers/class-name-generator";
import { BlockStyle } from "../../helpers/styling";
import { ImageReaderProps } from "./schema";
import { getDefaults, styles } from "./styles";

export const Image = ({
  style,
  props,
  block,
}: Pick<ImageReaderProps, "style" | "props" | "block">) => {
  const linkHref = props?.linkHref;

  const className = generateClassName();
  const base = block.base;
  const imageElement = (
    <img
      alt={props?.alt ?? ""}
      src={props?.src ?? ""}
      className={cn(className, base?.className)}
      id={base?.id}
    />
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
