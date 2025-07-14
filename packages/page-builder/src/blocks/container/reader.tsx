import { ReaderBlock } from "@vivid/builder";
import { generateClassName } from "../../helpers/class-name-generator";
import { BlockStyle } from "../../helpers/styling";
import { ContainerReaderProps, styles } from "./schema";

export const ContainerReader = ({
  style,
  props,
  ...rest
}: ContainerReaderProps) => {
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
