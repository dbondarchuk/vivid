import {
  EditorChildren,
  useCurrentBlock,
  useSetCurrentBlockRef,
} from "@vivid/builder";
import { cn } from "@vivid/ui";
import React, { memo } from "react";
import { BlockStyle } from "../../helpers/styling";
import { useClassName } from "../../helpers/use-class-name";
import { InlineContainerProps, styles } from "./schema";

const ChildrenWrapper = memo(
  ({
    children,
    className,
    style,
    id,
  }: {
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    id?: string;
  }) => {
    const ref = useSetCurrentBlockRef();

    return (
      <span className={className} ref={ref} style={style} id={id}>
        {children}
      </span>
    );
  },
);

const ChildWrapper = memo(
  ({
    children,
    className,
    style,
    id,
  }: {
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    id?: string;
  }) => {
    return (
      <span className={className} style={style} id={id}>
        {children}
      </span>
    );
  },
);

const allowOnly = ["InlineText", "Icon", "Link"];

export const InlineContainerEditor = ({
  style,
  props,
}: InlineContainerProps) => {
  const currentBlock = useCurrentBlock<InlineContainerProps>();

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
        childrenWrapper={ChildrenWrapper}
        childWrapper={ChildWrapper}
        id={base?.id}
        allowOnly={allowOnly}
      />
    </>
  );
};
