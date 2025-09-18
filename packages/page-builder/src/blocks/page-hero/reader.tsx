import { ReaderBlock } from "@vivid/builder";
import { cn } from "@vivid/ui";
import { generateClassName } from "../../helpers/class-name-generator";
import { BlockStyle } from "../../helpers/styling";
import { PageHeroReaderProps } from "./schema";
import { styles } from "./styles";

export const PageHeroReader = ({
  props,
  style,
  block,
  ...rest
}: PageHeroReaderProps) => {
  const title = props?.title?.children || [];
  const subtitle = props?.subtitle?.children || [];
  const buttons = props?.buttons?.children || [];
  const className = generateClassName();
  const base = block.base;

  return (
    <>
      <BlockStyle name={className} styleDefinitions={styles} styles={style} />
      <section className={cn(className, base?.className)} id={base?.id}>
        {title.map((child) => (
          <ReaderBlock key={child.id} {...rest} block={child} />
        ))}
        {subtitle.map((child) => (
          <ReaderBlock key={child.id} {...rest} block={child} />
        ))}
        {buttons.map((child) => (
          <ReaderBlock key={child.id} {...rest} block={child} />
        ))}
      </section>
    </>
  );
};
