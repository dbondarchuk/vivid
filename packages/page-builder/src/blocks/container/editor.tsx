import { EditorChildren, useCurrentBlock } from "@vivid/builder";
import { cn } from "@vivid/ui";
import { BlockStyle } from "../../helpers/styling";
import { useClassName } from "../../helpers/use-class-name";
import { ContainerProps, styles } from "./schema";

export const ContainerEditor = ({ style, props }: ContainerProps) => {
  const currentBlock = useCurrentBlock<ContainerProps>();

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
