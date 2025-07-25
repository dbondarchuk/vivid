import {
  EditorChildren,
  useCurrentBlock,
  useSelectedBlockId,
} from "@vivid/builder";
import { cn } from "@vivid/ui";
import React from "react";
import { BlockStyle } from "../../helpers/styling";
import { useClassName } from "../../helpers/use-class-name";
import { SimpleContainerProps, styles } from "./schema";

const ChildWrapper = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => <span className={className}>{children}</span>;

export const SimpleContainerEditor = ({
  style,
  props,
}: SimpleContainerProps) => {
  const currentBlock = useCurrentBlock<SimpleContainerProps>();

  const children = currentBlock.data?.props?.children;
  const className = useClassName();
  const base = currentBlock.base;
  const allowOnly = React.useMemo(() => ["SimpleText", "Icon", "Link"], []);

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
        className={cn(className, base?.className)}
        childWrapper={ChildWrapper}
        hidePrefixAddBlockButton={!isSelected}
        id={base?.id}
        addButtonSize="small"
        allowOnly={allowOnly}
      />
    </>
  );
};
