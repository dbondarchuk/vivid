import { ReaderBlock } from "@vivid/builder";
import { cn } from "@vivid/ui";
import { generateClassName } from "../../helpers/class-name-generator";
import { BlockStyle } from "../../helpers/styling";
import { ButtonDefaultUrl, ButtonReaderProps } from "./schema";
import { getDefaults, styles } from "./styles";

export const Button = ({ props, style, block, ...rest }: ButtonReaderProps) => {
  const url = props?.url ?? ButtonDefaultUrl;
  const content = props?.children?.[0];
  const defaults = getDefaults({ props, style }, false);

  const className = generateClassName();
  const base = block.base;

  return (
    <>
      <BlockStyle
        name={className}
        styleDefinitions={styles}
        styles={style}
        defaults={defaults}
      />
      <a
        href={url}
        target={props?.target ?? undefined}
        className={cn(className, base?.className)}
        id={base?.id}
      >
        {content && <ReaderBlock key={content.id} {...rest} block={content} />}
      </a>
    </>
  );
};
