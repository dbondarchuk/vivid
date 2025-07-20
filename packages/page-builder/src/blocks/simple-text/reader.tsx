import { cn } from "@vivid/ui";
import { generateClassName } from "../../helpers/class-name-generator";
import { BlockStyle } from "../../helpers/styling";
import { SimpleTextPropsDefaults, SimpleTextReaderProps } from "./schema";
import { getDefaults, styles } from "./styles";

export const SimpleText = ({ props, style, block }: SimpleTextReaderProps) => {
  const text = props?.text ?? SimpleTextPropsDefaults.props.text;
  const defaults = getDefaults({ props, style }, false);
  const base = block.base;

  const className = generateClassName();
  const Element = props?.url ? "a" : "span";

  return (
    <>
      <BlockStyle
        name={className}
        styleDefinitions={styles}
        styles={style}
        defaults={defaults}
      />
      <Element
        className={cn(className, base?.className)}
        id={base?.id}
        href={props?.url ?? undefined}
      >
        {text}
      </Element>
    </>
  );
};
