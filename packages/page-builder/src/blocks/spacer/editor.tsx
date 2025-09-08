"use client";

import { useCurrentBlock, useSetCurrentBlockRef } from "@vivid/builder";
import { Spacer } from "./reader";
import { SpacerProps } from "./schema";

export const SpacerEditor = ({}) => {
  const currentBlock = useCurrentBlock<SpacerProps>();
  const ref = useSetCurrentBlockRef();
  return <Spacer {...currentBlock.data} block={currentBlock} ref={ref} />;
};
