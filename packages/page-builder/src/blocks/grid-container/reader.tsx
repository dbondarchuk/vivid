import { ReaderBlock } from "@vivid/builder";
import { generateClassName } from "../../helpers/class-name-generator";
import { BlockStyle } from "../../helpers/styling";
import { GridContainerReaderProps, styles } from "./schema";

export const GridContainerReader = ({
  style,
  props,
  ...rest
}: GridContainerReaderProps) => {
  const children = props?.children ?? [];

  const className = generateClassName();

  return (
    <>
      <BlockStyle name={className} styleDefinitions={styles} styles={style} />
      <div className={className}>
        {children.map((child) => (
          <ReaderBlock key={child.id} block={child} {...rest} />
        ))}
      </div>
    </>
  );
};
