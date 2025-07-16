import { cn } from "@vivid/ui";
import { generateClassName } from "../../helpers/class-name-generator";
import { BlockStyle } from "../../helpers/styling";
import { HeadingPropsDefaults, HeadingReaderProps } from "./schema";
import { getDefaults, styles } from "./styles";

export const Heading = ({ props, style, block }: HeadingReaderProps) => {
  const level = props?.level ?? HeadingPropsDefaults.props.level;
  const text = props?.text ?? HeadingPropsDefaults.props.text;
  const defaults = getDefaults({ props, style }, false);

  const className = generateClassName();
  const Element = level;

  const base = block.base;

  return (
    <>
      <BlockStyle
        name={className}
        styleDefinitions={styles}
        styles={style}
        defaults={defaults}
      />
      <Element className={cn(className, base?.className)} id={base?.id}>
        {text}
      </Element>
    </>
  );
};
