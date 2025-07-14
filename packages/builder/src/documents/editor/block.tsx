"use client";

import { createContext, useContext, useEffect, useMemo } from "react";

import { findBlock } from "../helpers/blocks";
import { useDocument, useSetBlockDisableOptions } from "./context";
import { BlockDisableOptions, CoreEditorBlock, TEditorBlock } from "./core";

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
  // const context = useContext(EditorBlockContext);
  const block = useMemo(
    () => findBlock(document, currentBlockId)! as TEditorBlock<T>,
    [document, currentBlockId]
  );

  return block;
};

type EditorBlockProps = {
  block: TEditorBlock;
  isOverlay?: boolean;
  disableMove?: boolean;
  disableDelete?: boolean;
  disableClone?: boolean;
  disableDrag?: boolean;
};

export const EditorBlock = ({
  block,
  isOverlay,
  disableMove,
  disableDelete,
  disableClone,
  disableDrag,
}: EditorBlockProps) => {
  const setBlockDisableOptions = useSetBlockDisableOptions();

  useEffect(() => {
    setBlockDisableOptions(block.id, {
      move: disableMove,
      delete: disableDelete,
      clone: disableClone,
      drag: disableDrag,
    });
  }, [block.id, disableMove, disableDelete, disableClone, disableDrag]);

  return (
    <EditorBlockContext.Provider
      value={{ blockId: block.id, isOverlay: !!isOverlay }}
    >
      <CoreEditorBlock {...block} />
    </EditorBlockContext.Provider>
  );
};
