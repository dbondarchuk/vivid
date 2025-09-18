"use client";

import { useBlockEditor, useCurrentBlock } from "@vivid/builder";
import { useResizeBlockStyles } from "../../helpers/use-resize-block-styles";
import { SpacerProps } from "./schema";
import { Spacer } from "./spacer";

export const SpacerEditor = ({}) => {
  const currentBlock = useCurrentBlock<SpacerProps>();
  const resizeProps = useResizeBlockStyles();
  const overlayProps = useBlockEditor(currentBlock.id, resizeProps);

  return (
    <Spacer {...currentBlock.data} block={currentBlock} {...overlayProps} />
  );
};
