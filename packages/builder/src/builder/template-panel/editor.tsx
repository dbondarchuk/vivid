import { DragOverlay } from "@dnd-kit/react";
import { deepMemo, TabsContent } from "@vivid/ui";
import { EditorBlock } from "../../documents/editor/block";
import {
  useActiveDragBlock,
  useActiveOverBlock,
  useBlock,
  useBlockDepth,
  useBlocks,
  useRootBlockId,
} from "../../documents/editor/context";
import { ReaderBlock } from "../../documents/reader/block";
import { ReaderDocumentBlocksDictionary } from "../../documents/types";
import { memo, useMemo } from "react";

export const ActiveOverblockDebug = () => {
  const activeOverBlock = useActiveOverBlock();
  const block = useBlock(activeOverBlock?.blockId ?? null);
  const depth = useBlockDepth(activeOverBlock?.blockId ?? null);
  return (
    <div className="py-4 px-2 mx-auto w-full bg-red-800 text-white">
      Active Over Block:{" "}
      {block ? (
        <>
          {block.type}, {activeOverBlock?.property}, {activeOverBlock?.index},{" "}
          {depth}
        </>
      ) : (
        <>none</>
      )}
    </div>
  );
};

export const Editor = ({
  args,
  readerBlocks,
}: {
  args: any;
  readerBlocks: ReaderDocumentBlocksDictionary<any>;
}) => {
  const rootBlockId = useRootBlockId();
  return (
    <TabsContent value="editor" className="mt-0">
      <EditorBlock
        blockId={rootBlockId}
        index={0}
        parentBlockId={rootBlockId}
        parentProperty="children"
      />
    </TabsContent>
  );
};

export const BlockDragOverlay = memo(() => {
  const activeDragBlock = useActiveDragBlock();

  const dragBlockId = activeDragBlock?.blockId;
  const RenderedBlock = useMemo(() => {
    if (!dragBlockId) return null;

    return (
      <EditorBlock
        blockId={dragBlockId}
        index={0}
        parentBlockId={""}
        parentProperty={""}
        disableClone
        disableDelete
        disableMove
        disableDrag
        isOverlay
      />
    );
  }, [dragBlockId]);

  return <DragOverlay>{RenderedBlock}</DragOverlay>;
});
