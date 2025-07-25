import {
  EditorChildren,
  useCurrentBlock,
  useSelectedBlockId,
} from "@vivid/builder";
import { cn } from "@vivid/ui";
import { BlockStyle } from "../../helpers/styling";
import { useClassName } from "../../helpers/use-class-name";
import { GridContainerProps, styles } from "./schema";

export const GridContainerEditor = ({ style, props }: GridContainerProps) => {
  const currentBlock = useCurrentBlock<GridContainerProps>();

  const children = currentBlock.data?.props?.children;
  const className = useClassName();
  const base = currentBlock.base;

  const isSelected = useSelectedBlockId() === currentBlock.id;

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
        hidePrefixAddBlockButton={!isSelected}
        className={cn(className, base?.className)}
        id={base?.id}
      />
    </>
  );
};
