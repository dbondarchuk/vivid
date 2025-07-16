import {
  cloneBlockInLevel,
  deleteBlockInLevel,
  findBlock,
  findParentBlock,
  insertBlockInLevel,
  moveBlockInLevel,
  swapBlockInLevel,
} from "../helpers/blocks";
import { TEditorConfiguration } from "./core";
import { EditorHistoryEntry } from "./history";

export const editorHistoryReducer = (
  originalDocument: TEditorConfiguration,
  selectedBlockId: string | null,
  { type, value }: EditorHistoryEntry
) => {
  const document = JSON.parse(JSON.stringify(originalDocument));
  let newSelectedBlockId: string | null = selectedBlockId;

  switch (type) {
    case "document":
      return { document: value.document, selectedBlockId };

    case "delete-block": {
      const parent = findParentBlock(document, value.blockId);
      if (parent) {
        deleteBlockInLevel(parent.block, value.blockId);
        if (selectedBlockId === value.blockId) newSelectedBlockId = null;
      }

      break;
    }

    case "clone-block": {
      const parent = findParentBlock(document, value.blockId);
      if (parent) {
        const newBlock = cloneBlockInLevel(parent.block, value.blockId);
        if (newBlock) newSelectedBlockId = newBlock.id;
      }

      break;
    }

    case "move-block-up": {
      const parent = findParentBlock(document, value.blockId);
      if (parent) moveBlockInLevel(parent.block, value.blockId, "up");
      break;
    }

    case "move-block-down": {
      const parent = findParentBlock(document, value.blockId);
      if (parent) moveBlockInLevel(parent.block, value.blockId, "down");
      break;
    }

    case "swap-block": {
      const parent = findParentBlock(document, value.blockId1);
      if (parent) {
        swapBlockInLevel(parent.block, value.blockId1, value.blockId2);
      }

      break;
    }

    case "move-block": {
      const parent = findParentBlock(document, value.blockId);
      const newParent = findBlock(document, value.parentBlockId);

      if (parent && newParent) {
        const block = deleteBlockInLevel(parent.block, value.blockId);
        insertBlockInLevel(
          newParent,
          block!,
          value.parentBlockProperty,
          value.index || 0
        );
      }

      break;
    }

    case "set-block-data": {
      const block = findBlock(document, value.blockId);
      if (block) block.data = value.data;

      break;
    }

    case "set-block-base": {
      const block = findBlock(document, value.blockId);
      if (block) block.base = value.base;

      break;
    }
  }

  return { document, selectedBlockId: newSelectedBlockId };
};
