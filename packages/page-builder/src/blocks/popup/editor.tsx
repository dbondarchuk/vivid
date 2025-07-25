"use client";

import { EditorBlock, useCurrentBlock } from "@vivid/builder";
import { useI18n } from "@vivid/i18n";
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

  const title = currentBlock.data?.props?.title?.children?.[0];
  const subtitle = currentBlock.data?.props?.subtitle?.children?.[0];
  const content = currentBlock.data?.props?.content?.children?.[0];
  const buttons = currentBlock.data?.props?.buttons?.children?.[0];
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
          <div
            className={cn(
              "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none text-muted-foreground"
            )}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </div>
          <DialogHeader>
            <div className="text-lg font-semibold leading-none tracking-tight">
              {title && <EditorBlock block={title} {...disable} />}
            </div>
            <div className="text-sm text-muted-foreground">
              {subtitle && <EditorBlock block={subtitle} {...disable} />}
            </div>
          </DialogHeader>
          {content && <EditorBlock block={content} {...disable} />}
          <DialogFooter>
            {buttons && <EditorBlock block={buttons} {...disable} />}
          </DialogFooter>
        </div>
        {/* </Dialog> */}
      </div>
    </>
  );
};
