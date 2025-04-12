"use client";

import { createContext, useContext } from "react";

import { findBlock } from "../helpers/blocks";
import { useDocument } from "./context";
import { CoreEditorBlock, TEditorBlock } from "./core";

const EditorBlockContext = createContext<{
  blockId: string;
  isOverlay: boolean;
}>({
  blockId: "",
  isOverlay: false,
});

export const useCurrentBlockId = () => useContext(EditorBlockContext).blockId;
export const useCurrentBlockIsOverlay = () =>
  useContext(EditorBlockContext).isOverlay;

export const useCurrentBlock = <T,>() => {
  const currentBlockId = useCurrentBlockId();
  const document = useDocument();
  return findBlock(document, currentBlockId)! as TEditorBlock<T>;
};

type EditorBlockProps = {
  block: TEditorBlock;
  isOverlay?: boolean;
};

export const EditorBlock = ({ block, isOverlay }: EditorBlockProps) => {
  return (
    <EditorBlockContext.Provider
      value={{ blockId: block.id, isOverlay: !!isOverlay }}
    >
      <CoreEditorBlock {...block} />
    </EditorBlockContext.Provider>
  );
};
