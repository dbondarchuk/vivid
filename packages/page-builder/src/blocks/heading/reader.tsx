import { ReaderBlock } from "@vivid/builder";
import { cn } from "@vivid/ui";
import { generateClassName } from "../../helpers/class-name-generator";
import { BlockStyle } from "../../helpers/styling";
import {
  DefaultHeadingLevel,
  HeadingPropsDefaults,
  HeadingReaderProps,
} from "./schema";
import { getDefaults, styles } from "./styles";

export const Heading = ({
  props,
  style,
  block,
  ...rest
}: HeadingReaderProps) => {
  const level = props?.level ?? DefaultHeadingLevel;
  const content = props?.children?.[0];
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
        {content && <ReaderBlock key={content.id} {...rest} block={content} />}
      </Element>
    </>
  );
};
