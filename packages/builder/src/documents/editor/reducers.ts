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
  oiriginalDocument: TEditorConfiguration,
  selectedBlockId: string | null,
  { type, value }: EditorHistoryEntry
) => {
  const document = JSON.parse(JSON.stringify(oiriginalDocument));
  let newSelectedBlockId: string | null = selectedBlockId;

  switch (type) {
    case "document":
      return { document: value.document, selectedBlockId };

    case "delete-block": {
      const parent = findParentBlock(document, value.blockId);
      if (parent) {
        deleteBlockInLevel(parent, value.blockId);
        if (selectedBlockId === value.blockId) newSelectedBlockId = null;
      }

      break;
    }

    case "clone-block": {
      const parent = findParentBlock(document, value.blockId);
      if (parent) {
        const newBlock = cloneBlockInLevel(parent, value.blockId);
        if (newBlock) newSelectedBlockId = newBlock.id;
      }

      break;
    }

    case "move-block-up": {
      const parent = findParentBlock(document, value.blockId);
      if (parent) moveBlockInLevel(parent, value.blockId, "up");
      break;
    }

    case "move-block-down": {
      const parent = findParentBlock(document, value.blockId);
      if (parent) moveBlockInLevel(parent, value.blockId, "down");
      break;
    }

    case "swap-block": {
      const parent = findParentBlock(document, value.blockId1);
      if (parent) {
        swapBlockInLevel(parent, value.blockId1, value.blockId2);
      }

      break;
    }

    case "move-block": {
      const parent = findParentBlock(document, value.blockId);
      const newParent = findBlock(document, value.parentBlockId);

      if (parent && newParent) {
        const block = deleteBlockInLevel(parent, value.blockId);
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
  }

  return { document, selectedBlockId: newSelectedBlockId };
};
