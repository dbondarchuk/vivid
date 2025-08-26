import {
  EditorChildren,
  useCurrentBlock,
  useIsSelectedBlock,
} from "@vivid/builder";
import { cn } from "@vivid/ui";
import { BlockStyle } from "../../helpers/styling";
import { useClassName } from "../../helpers/use-class-name";
import { GridContainerProps, styles } from "./schema";

export const GridContainerEditor = ({ style, props }: GridContainerProps) => {
  const currentBlock = useCurrentBlock<GridContainerProps>();

  const className = useClassName();
  const base = currentBlock.base;

  return (
    <>
      <BlockStyle
        name={className}
        styleDefinitions={styles}
        styles={currentBlock.data?.style}
      />
      <EditorChildren
        blockId={currentBlock.id}
        property="props"
        className={cn(className, base?.className)}
        id={base?.id}
      />
    </>
  );
};
