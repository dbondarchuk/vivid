import { ReaderBlock } from "@vivid/builder";
import { generateClassName } from "../../helpers/class-name-generator";
import { BlockStyle } from "../../helpers/styling";
import { GridContainerReaderProps, styles } from "./schema";
import { cn } from "@vivid/ui";

export const GridContainerReader = ({
  style,
  props,
  block,
  ...rest
}: GridContainerReaderProps) => {
  const children = props?.children ?? [];

  const className = generateClassName();
  const base = block.base;

  return (
    <>
      <BlockStyle name={className} styleDefinitions={styles} styles={style} />
      <div className={cn(className, base?.className)} id={base?.id}>
        {children.map((child) => (
          <ReaderBlock key={child.id} {...rest} block={child} />
        ))}
      </div>
    </>
  );
};
