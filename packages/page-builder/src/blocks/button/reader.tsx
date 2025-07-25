import { ReaderBlock } from "@vivid/builder";
import { cn } from "@vivid/ui";
import { generateClassName } from "../../helpers/class-name-generator";
import { BlockStyle } from "../../helpers/styling";
import { Button } from "./button";
import { ButtonReaderProps } from "./schema";
import { getDefaults, styles } from "./styles";

export const ButtonReader = ({
  props,
  style,
  block,
  ...rest
}: ButtonReaderProps) => {
  const content = props?.children?.[0];
  const defaults = getDefaults({ props, style }, false);

  const className = generateClassName();
  const base = block.base;

  const { children, ...restProps } = props || {};

  return (
    <>
      <BlockStyle
        name={className}
        styleDefinitions={styles}
        styles={style}
        defaults={defaults}
      />
      <Button
        id={base?.id}
        className={cn(className, base?.className)}
        {...restProps}
      >
        {content && <ReaderBlock key={content.id} {...rest} block={content} />}
      </Button>
    </>
  );
};
