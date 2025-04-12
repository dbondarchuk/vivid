import React from "react";
import { EditorBlockWrapper } from "../blocks/helpers/block-wrappers/editor-block-wrapper";
import { templateProps } from "../helpers/template-props";
import { BlockConfiguration } from "../types";
import { useBlocks, useEditorArgs, useRootBlock } from "./context";

export const templatePropsFromContext = (props: any) => {
  const args = useEditorArgs();
  return templateProps(props, args);
};

export const CoreEditorBlock: React.FC<BlockConfiguration<any>> = ({
  type,
  data,
}) => {
  const blocks = useBlocks();
  const rootBlock = useRootBlock();

  const Component = blocks[type].Editor;
  if (rootBlock.type === type) return <Component {...data} />;

  return (
    <EditorBlockWrapper>
      <Component {...data} />
    </EditorBlockWrapper>
  );
};

export type TEditorBlock<T = any> = { type: string; data: T; id: string };
export type TEditorConfiguration = TEditorBlock;
