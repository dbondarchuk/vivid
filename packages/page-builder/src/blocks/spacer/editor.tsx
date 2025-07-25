"use client";

import { useCurrentBlock } from "@vivid/builder";
import { Spacer } from "./reader";
import { SpacerProps } from "./schema";

export const SpacerEditor = ({}) => {
  const currentBlock = useCurrentBlock<SpacerProps>();
  return <Spacer {...currentBlock.data} block={currentBlock} />;
};
