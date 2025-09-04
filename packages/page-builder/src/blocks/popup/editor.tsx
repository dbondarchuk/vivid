"use client";

import {
  EditorBlock,
  useBlockChildrenBlockIds,
  useCurrentBlock,
} from "@vivid/builder";
import { cn, DialogFooter, DialogHeader } from "@vivid/ui";
import { X } from "lucide-react";
import { BlockStyle } from "../../helpers/styling";
import { useClassName } from "../../helpers/use-class-name";
import { PopupProps } from "./schema";
import { styles } from "./styles";

const disable = {
  disableMove: true,
  disableDelete: true,
  disableClone: true,
  disableDrag: true,
};

export const PopupEditor = ({ props, style }: PopupProps) => {
  const currentBlock = useCurrentBlock<PopupProps>();

  const titleId = useBlockChildrenBlockIds(currentBlock.id, "props.title")?.[0];
  const subtitleId = useBlockChildrenBlockIds(
    currentBlock.id,
    "props.subtitle",
  )?.[0];
  const contentId = useBlockChildrenBlockIds(
    currentBlock.id,
    "props.content",
  )?.[0];
  const buttonsId = useBlockChildrenBlockIds(
    currentBlock.id,
    "props.buttons",
  )?.[0];
  const noClose = props?.noClose;
  const className = useClassName();
  const base = currentBlock.base;

  return (
    <>
      <BlockStyle name={className} styleDefinitions={styles} styles={style} />
      <div className="relative bg-muted flex flex-col items-center grow">
        {/* <Dialog>
        <DialogTrigger asChild>
          <Button>{t("pageBuilder.blocks.popup.open")}</Button>
        </DialogTrigger> */}

        <div
          className={cn("relative grid", className, base?.className)}
          id={base?.id}
        >
          {!noClose && (
            <div
              className={cn(
                "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none text-muted-foreground",
              )}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </div>
          )}
          <DialogHeader>
            <div className="text-lg font-semibold leading-none tracking-tight">
              {!!titleId && (
                <EditorBlock
                  blockId={titleId}
                  {...disable}
                  index={0}
                  parentBlockId={currentBlock.id}
                  parentProperty="title"
                  allowedTypes="InlineContainer"
                />
              )}
            </div>
            <div className="text-sm text-muted-foreground">
              {!!subtitleId && (
                <EditorBlock
                  blockId={subtitleId}
                  {...disable}
                  index={0}
                  parentBlockId={currentBlock.id}
                  parentProperty="subtitle"
                  allowedTypes="InlineContainer"
                />
              )}
            </div>
          </DialogHeader>
          {!!contentId && (
            <EditorBlock
              blockId={contentId}
              {...disable}
              index={0}
              parentBlockId={currentBlock.id}
              parentProperty="content"
            />
          )}
          <DialogFooter>
            {!!buttonsId && (
              <EditorBlock
                blockId={buttonsId}
                {...disable}
                index={0}
                parentBlockId={currentBlock.id}
                parentProperty="buttons"
              />
            )}
          </DialogFooter>
        </div>
        {/* </Dialog> */}
      </div>
    </>
  );
};
