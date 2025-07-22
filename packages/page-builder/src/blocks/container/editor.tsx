import { EditorChildren, useCurrentBlock } from "@vivid/builder";
import { cn } from "@vivid/ui";
import { generateClassName } from "../../helpers/class-name-generator";
import { BlockStyle } from "../../helpers/styling";
import { ContainerProps, styles } from "./schema";

export const ContainerEditor = ({ style, props }: ContainerProps) => {
  const currentBlock = useCurrentBlock<ContainerProps>();

  const children = currentBlock.data?.props?.children;
  const className = generateClassName();
  const base = currentBlock.base;
  return (
    <>
      <BlockStyle
        name={className}
        styleDefinitions={styles}
        styles={currentBlock.data?.style}
      />
      <EditorChildren
        block={currentBlock}
        property="props"
        children={children || []}
        className={cn(className, base?.className)}
        id={base?.id}
      />
    </>
  );
};
