"use client";

import { createContext, useContext, useEffect, useMemo } from "react";

import { findBlock } from "../helpers/blocks";
import { useDocument, useSetBlockDisableOptions } from "./context";
import { CoreEditorBlock, TEditorBlock } from "./core";
import { deepMemo } from "@vivid/ui";

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
  additionalProps?: Record<string, any>;
};

export const EditorBlock = deepMemo(
  ({
    block,
    isOverlay,
    disableMove,
    disableDelete,
    disableClone,
    disableDrag,
    additionalProps,
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

    const blockContext = useMemo(
      () => ({ blockId: block.id, isOverlay: !!isOverlay }),
      [block.id, isOverlay]
    );

    return (
      <EditorBlockContext.Provider value={blockContext}>
        <CoreEditorBlock {...block} additionalProps={additionalProps} />
      </EditorBlockContext.Provider>
    );
  }
);
