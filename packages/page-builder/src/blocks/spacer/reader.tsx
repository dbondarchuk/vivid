import { cn } from "@vivid/ui";
import { generateClassName } from "../../helpers/class-name-generator";
import { BlockStyle } from "../../helpers/styling";
import { SpacerReaderProps } from "./schema";
import { getDefaults, styles } from "./styles";

export const Spacer = ({
  props,
  style,
  block,
}: Pick<SpacerReaderProps, "props" | "style" | "block">) => {
  const className = generateClassName();
  const defaults = getDefaults({ props, style });
  const base = block?.base;

  return (
    <>
      <BlockStyle
        name={className}
        styleDefinitions={styles}
        defaults={defaults}
        styles={style}
      />
      <div className={cn(className, base?.className)} id={base?.id} />
    </>
  );
};
