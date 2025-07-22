import { EditorChildren, useCurrentBlock } from "@vivid/builder";
import { cn } from "@vivid/ui";
import { generateClassName } from "../../helpers/class-name-generator";
import { BlockStyle } from "../../helpers/styling";
import { GridContainerProps, styles } from "./schema";

export const GridContainerEditor = ({ style, props }: GridContainerProps) => {
  const currentBlock = useCurrentBlock<GridContainerProps>();

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
        hidePrefixAddBlockButton
        className={cn(className, base?.className)}
        id={base?.id}
      />
    </>
  );
};
