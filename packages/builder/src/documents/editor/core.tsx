import React, { memo, useMemo } from "react";
import { templateProps } from "../helpers/template-props";
import { BaseBlockProps } from "../types";
import {
  useBlock,
  useBlocks,
  useEditorArgs,
  useRootBlockType,
} from "./context";

export const templatePropsFromContext = (props: any) => {
  const args = useEditorArgs();
  return templateProps(props, args);
};

export const CoreEditorBlock: React.FC<{
  blockId: string;
  additionalProps?: Record<string, any>;
  index: number;
  parentBlockId: string;
  parentProperty: string;
}> = memo(
  ({ blockId, additionalProps, index, parentBlockId, parentProperty }) => {
    const blocks = useBlocks();
    const rootBlockType = useRootBlockType();
    const block = useBlock(blockId)!;

    const Component = useMemo(
      () => blocks[block.type].Editor,
      [blocks, block.type],
    );

    if (rootBlockType === block.type) return <Component {...block.data} />;

    return <Component {...block.data} base={block.base} {...additionalProps} />;
  },
);

export type BlockDisableOptions = {
  drag?: boolean;
  delete?: boolean;
  move?: boolean;
  clone?: boolean;
};

export type TEditorBlock<T = any> = {
  type: string;
  data: T;
  id: string;
  base?: BaseBlockProps;
};

export type TEditorConfiguration = TEditorBlock;
