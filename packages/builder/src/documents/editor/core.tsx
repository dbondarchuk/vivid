import React from "react";
import { EditorBlockWrapper } from "../blocks/helpers/block-wrappers/editor-block-wrapper";
import { templateProps } from "../helpers/template-props";
import { BaseBlockProps, BlockConfiguration } from "../types";
import { useBlocks, useEditorArgs, useRootBlock } from "./context";

export const templatePropsFromContext = (props: any) => {
  const args = useEditorArgs();
  return templateProps(props, args);
};

export const CoreEditorBlock: React.FC<
  BlockConfiguration<any> & { additionalProps?: Record<string, any> }
> = ({ type, data, additionalProps }) => {
  const blocks = useBlocks();
  const rootBlock = useRootBlock();

  const Component = blocks[type].Editor;
  if (rootBlock.type === type) return <Component {...data} />;

  // console.log("CoreEditorBlock - rerender", type, data);

  return (
    <EditorBlockWrapper>
      <Component {...data} {...additionalProps} />
    </EditorBlockWrapper>
  );
};

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
