"use client";

import { useCurrentBlock } from "@vivid/builder";
import { CustomHTMLProps } from "./schema";

export const CustomHTMLEditor = () => {
  const currentBlock = useCurrentBlock<CustomHTMLProps>();
  const html = (currentBlock?.data?.props as any)?.html ?? "";
  const base = currentBlock?.base;

  return (
    <div
      className={base?.className}
      id={base?.id}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
