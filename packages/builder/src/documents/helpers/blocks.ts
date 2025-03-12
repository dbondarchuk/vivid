import z from "zod";

import { resolve } from "@vivid/utils";
import { TEditorBlock, TEditorConfiguration } from "../editor/core";
import { BuilderSchema } from "../types";
import { generateId } from "./block-id";

const findChildrenProps = (obj: any): any[] => {
  if (!obj || typeof obj !== "object") return [];
  const result = [];
  for (const prop of Object.keys(obj)) {
    if (prop === "children" && Array.isArray(obj[prop])) result.push(obj[prop]);
    else result.push(...findChildrenProps(obj[prop]));
  }

  return result;
};

const findChildrenProp = (obj: any): any[] => {
  if (!obj || typeof obj !== "object") return [];
  const result = [];
  for (const prop of Object.keys(obj)) {
    if (prop === "children" && Array.isArray(obj[prop])) result.push(obj);
    else result.push(...findChildrenProp(obj[prop]));
  }

  return result;
};

export const deleteBlockInLevel = (block: TEditorBlock, blockId: string) => {
  const childrenProps = findChildrenProp(block.data);
  let toRemove = -1;
  for (const prop of childrenProps) {
    for (let i = 0; i < prop.children.length; i++) {
      const child = prop.children[i] as TEditorBlock;
      if (child.id === blockId) {
        toRemove = i;
        break;
      }
    }

    if (toRemove >= 0) {
      const result = (prop.children as any[]).splice(toRemove, 1);
      return result[0] as TEditorBlock;
    }
  }
};

export const insertBlockInLevel = (
  block: TEditorBlock,
  newBlock: TEditorBlock,
  property: string | undefined | null,
  index: number
) => {
  const prop = property
    ? resolve(block, property, true)
    : findChildrenProp(block)[0];
  if (!prop) return;

  if (!prop.children) prop.children = [];
  (prop.children as any[]).splice(index, 0, newBlock);
};

export const moveBlockInLevel = (
  block: TEditorBlock,
  blockId: string,
  dir: "up" | "down"
) => {
  const childrenProps = findChildrenProp(block.data);
  let index = -1;
  for (const prop of childrenProps) {
    for (let i = 0; i < prop.children.length; i++) {
      const child = prop.children[i] as TEditorBlock;
      if (child.id === blockId) {
        index = i;
        break;
      }
    }

    if (index >= 0) {
      const value = prop.children[index];
      if (dir == "up" && index > 0) {
        const a = prop.children[index - 1];
        prop.children[index - 1] = value;
        prop.children[index] = a;
      } else if (dir == "down" && index < prop.children.length - 1) {
        const a = prop.children[index + 1];
        prop.children[index + 1] = value;
        prop.children[index] = a;
      }
      break;
    }
  }
};

export const swapBlockInLevel = (
  block: TEditorBlock,
  blockId1: string,
  blockId2: string
) => {
  const childrenProps = findChildrenProp(block.data);
  let index1 = -1;
  let index2 = -1;
  for (const prop of childrenProps) {
    for (let i = 0; i < prop.children.length; i++) {
      const child = prop.children[i] as TEditorBlock;
      if (child.id === blockId1) {
        index1 = i;
      }

      if (child.id === blockId2) {
        index2 = i;
      }

      if (index1 >= 0 && index2 >= 0) break;
    }

    if (index1 >= 0 && index2 >= 0) {
      const value = prop.children[index1];
      prop.children[index1] = prop.children[index2];
      prop.children[index2] = value;

      break;
    }
  }
};

const regenerateIds = (block: any) => {
  if (!block || typeof block !== "object") return;
  if ("id" in block && "type" in block && "data" in block)
    block.id = generateId();
  for (const value of Object.values(block)) {
    regenerateIds(value);
  }
};

const cloneBlock = (block: TEditorBlock) => {
  const newBlock = JSON.parse(JSON.stringify(block)) as TEditorBlock;
  regenerateIds(newBlock);

  return newBlock;
};

export const cloneBlockInLevel = (block: TEditorBlock, blockId: string) => {
  const childrenProps = findChildrenProp(block.data);
  let index = -1;
  for (const prop of childrenProps) {
    for (let i = 0; i < prop.children.length; i++) {
      const child = prop.children[i] as TEditorBlock;
      if (child.id === blockId) {
        index = i;
        break;
      }
    }

    if (index >= 0) {
      const value = prop.children[index];
      const newBlock = cloneBlock(value);
      (prop.children as any[]).splice(index, 0, newBlock);

      return newBlock;
    }
  }
};

const recursiveFindBlock = (
  block: TEditorBlock,
  blockId: string
): TEditorBlock | null => {
  if (block.id === blockId) return block;

  const childrenProps = findChildrenProps(block.data).flatMap((x) => x);
  for (const child of (childrenProps as TEditorBlock[]) || []) {
    if (!child || !("id" in child)) continue;
    const result = recursiveFindBlock(child, blockId);
    if (result) return result;
  }

  return null;
};

const recursiveValidateBlocks = (
  block: TEditorBlock,
  schemas: BuilderSchema
): Record<
  string,
  {
    type: string;
    error: z.ZodError;
  }
> => {
  let results: Record<
    string,
    {
      type: string;
      error: z.ZodError;
    }
  > = {};

  if (!block) return results;

  const parseResult = schemas[block.type].safeParse(block.data);
  if (!parseResult.success) {
    results[block.id] = {
      error: parseResult.error,
      type: block.type,
    };
  }

  const childrenProps = findChildrenProps(block.data).flatMap((x) => x);
  for (const child of (childrenProps as TEditorBlock[]) || []) {
    if (!child || !("id" in child)) continue;

    const result = recursiveValidateBlocks(child, schemas);
    results = { ...results, ...result };
  }

  return results;
};

const recursiveFindBlockHierarchy = (
  block: TEditorBlock,
  blockId: string
): TEditorBlock[] | null => {
  if (block.id === blockId) return [block];

  const childrenProps = findChildrenProps(block.data).flatMap((x) => x);
  for (const child of (childrenProps as TEditorBlock[]) || []) {
    if (!child || !("id" in child)) continue;
    const result = recursiveFindBlockHierarchy(child, blockId);
    if (result) return [block, ...result];
  }

  return null;
};

const recursiveFindParentBlock = (
  block: TEditorBlock,
  blockId: string,
  parent: TEditorBlock
): TEditorBlock | null => {
  if (block.id === blockId) return parent;

  const childrenProps = findChildrenProps(block.data).flatMap((x) => x);
  for (const child of (childrenProps as TEditorBlock[]) || []) {
    if (!child || !("id" in child)) continue;
    const result = recursiveFindParentBlock(child, blockId, block);
    if (result) return result;
  }

  return null;
};

export const findBlock = (document: TEditorConfiguration, blockId: string) => {
  return recursiveFindBlock(document, blockId);
};

export const validateBlocks = (
  document: TEditorConfiguration,
  schemas: BuilderSchema
) => {
  return recursiveValidateBlocks(document, schemas);
};

export const findBlockHierarchy = (
  document: TEditorConfiguration,
  blockId: string
) => {
  return recursiveFindBlockHierarchy(document, blockId);
};

export const findParentBlock = (
  document: TEditorConfiguration,
  blockId: string
) => {
  return recursiveFindParentBlock(document, blockId, document);
};
