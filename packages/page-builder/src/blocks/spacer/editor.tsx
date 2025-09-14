"use client";

import { useBlockEditor, useCurrentBlock } from "@vivid/builder";
import { Spacer } from "./reader";
import { SpacerProps } from "./schema";

export const SpacerEditor = ({}) => {
  const currentBlock = useCurrentBlock<SpacerProps>();
  const overlayProps = useBlockEditor(currentBlock.id);

  return (
    <Spacer {...currentBlock.data} block={currentBlock} {...overlayProps} />
  );
};
