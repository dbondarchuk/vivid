"use client";

import { cn } from "@udecode/cn";
import {
  type UseVirtualFloatingOptions,
  flip,
  offset,
} from "@udecode/plate-floating";
import {
  type LinkFloatingToolbarState,
  LinkOpenButton,
} from "@udecode/plate-link/react";

import { useEditorRef, useFormInputProps } from "@udecode/plate/react";
import { ExternalLink, Link, Text, Unlink } from "lucide-react";
import { ReactEditor } from "slate-react";

import {
  FloatingLinkUrlInput,
  useFloatingLinkEdit,
  useFloatingLinkEditState,
  useFloatingLinkInsert,
  useFloatingLinkInsertState,
} from "./use-floating-link";

import {
  buttonVariants,
  inputVariants,
  popoverVariants,
  Separator,
} from "@vivid/ui";
import { useCallback, useMemo } from "react";

const floatingOptions: UseVirtualFloatingOptions = {
  middleware: [
    offset(12),
    flip({
      fallbackPlacements: ["bottom-end", "top-start", "top-end"],
      padding: 12,
    }),
  ],
  placement: "bottom-start",
};

export interface LinkFloatingToolbarProps {
  state?: LinkFloatingToolbarState;
}

export function LinkFloatingToolbar({ state }: LinkFloatingToolbarProps) {
  const editor = useEditorRef();
  const insertState = useFloatingLinkInsertState({
    ...state,
    floatingOptions: {
      ...floatingOptions,
      ...state?.floatingOptions,
    },
  });
  const {
    hidden,
    props: insertProps,
    ref: insertRef,
    textInputProps,
  } = useFloatingLinkInsert(insertState);

  const editState = useFloatingLinkEditState({
    ...state,
    floatingOptions: {
      ...floatingOptions,
      ...state?.floatingOptions,
    },
  });
  const {
    editButtonProps,
    props: editProps,
    ref: editRef,
    unlinkButtonProps,
  } = useFloatingLinkEdit(editState);
  const inputProps = useFormInputProps({
    preventDefaultOnEnterKeydown: true,
  });

  const getSelectionAbsolutePosition = useCallback(() => {
    if (!editor.selection) return;

    try {
      const domRange = ReactEditor.toDOMRange(
        editor as unknown as ReactEditor,
        editor.selection,
      );

      const rect = domRange.getBoundingClientRect();

      const editorContainer = ReactEditor.toDOMNode(
        editor as unknown as ReactEditor,
        editor.children[0],
      ).parentElement;

      if (!editorContainer) return;

      const editorRect = editorContainer.getBoundingClientRect();

      // Calculate the maximum x position
      const maxWidth = editorRect.width - 288; // 288px for w-72
      let x = rect.left - editorRect.left + editorContainer.scrollLeft;

      // Ensure x does not exceed the maximum width
      x = Math.min(x, maxWidth);

      return {
        x: x,
        y: rect.top - editorRect.top + editorContainer.scrollTop + 20,
      };
    } catch (error) {
      return;
    }
  }, [editor]);

  const currentAbsolutePosition = useMemo(() => {
    // This will only be recalculated when `editor.selection` changes
    return getSelectionAbsolutePosition();
  }, [editor.selection, getSelectionAbsolutePosition]);

  if (hidden) return null;

  const input = (
    <div className="flex w-[330px] flex-col" {...inputProps}>
      <div className="flex items-center">
        <div className="flex items-center pr-1 pl-2 text-muted-foreground">
          <Link className="size-4" />
        </div>

        <FloatingLinkUrlInput
          className={inputVariants({ h: "sm", variant: "ghost" })}
          placeholder="Paste link"
          data-plate-focus
        />
      </div>
      <Separator className="my-1" />
      <div className="flex items-center">
        <div className="flex items-center pr-1 pl-2 text-muted-foreground">
          <Text className="size-4" />
        </div>
        <input
          className={inputVariants({ h: "sm", variant: "ghost" })}
          placeholder="Text to display"
          data-plate-focus
          {...textInputProps}
        />
      </div>
    </div>
  );

  const editContent = editState.isEditing ? (
    input
  ) : (
    <div className="box-content flex items-center">
      <button
        className={buttonVariants({ size: "sm", variant: "ghost" })}
        type="button"
        {...editButtonProps}
      >
        Edit link
      </button>

      <Separator orientation="vertical" />

      <LinkOpenButton
        className={buttonVariants({
          size: "icon",
          variant: "ghost",
        })}
      >
        <ExternalLink width={18} />
      </LinkOpenButton>

      <Separator orientation="vertical" />

      <button
        className={buttonVariants({
          size: "icon",
          variant: "ghost",
        })}
        type="button"
        {...unlinkButtonProps}
      >
        <Unlink width={18} />
      </button>
    </div>
  );

  return (
    <>
      <div
        ref={insertRef}
        className={cn(popoverVariants(), "w-auto p-1")}
        {...insertProps}
        style={{
          ...insertProps.style,
          // top: currentAbsolutePosition?.y,
          // left: currentAbsolutePosition?.x,
        }}
      >
        {input}
      </div>

      <div
        ref={editRef}
        className={cn(popoverVariants(), "w-auto p-1")}
        {...editProps}
        style={{
          ...editProps.style,
          // top: currentAbsolutePosition?.y,
          // left: currentAbsolutePosition?.x,
        }}
      >
        {editContent}
      </div>
    </>
  );
}
