import {
  EditorChildren,
  useCurrentBlock,
  useIsSelectedBlock,
} from "@vivid/builder";
import { cn } from "@vivid/ui";
import React, { memo } from "react";
import { BlockStyle } from "../../helpers/styling";
import { useClassName } from "../../helpers/use-class-name";
import { SimpleContainerProps, styles } from "./schema";

const ChildWrapper = memo(
  ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => <span className={className}>{children}</span>
);

const allowOnly = ["SimpleText", "Icon", "Link"];

export const SimpleContainerEditor = ({
  style,
  props,
}: SimpleContainerProps) => {
  const currentBlock = useCurrentBlock<SimpleContainerProps>();

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
        childWrapper={ChildWrapper}
        id={base?.id}
        allowOnly={allowOnly}
      />
    </>
  );
};
