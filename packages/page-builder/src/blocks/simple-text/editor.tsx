"use client";

import React, { useCallback, useRef } from "react";
import sanitizeHtml from "sanitize-html";

import {
  useCurrentBlock,
  useDispatchAction,
  useEditorArgs,
  usePortalContext,
  useSelectedBlockId,
  useSetSelectedBlockId,
} from "@vivid/builder";
import { ArgumentsAutocomplete, cn } from "@vivid/ui";
import { generateClassName } from "../../helpers/class-name-generator";
import { BlockStyle } from "../../helpers/styling";
import { SimpleTextProps } from "./schema";
import { getDefaults, styles } from "./styles";

export function SimpleTextEditor({ props, style }: SimpleTextProps) {
  const ref = useRef<HTMLInputElement>(null);
  const args = useEditorArgs();
  const currentBlock = useCurrentBlock<SimpleTextProps>();
  const value = currentBlock?.data?.props?.text;
  const dispatchAction = useDispatchAction();
  const setSelectedBlockId = useSetSelectedBlockId();

  const { document } = usePortalContext();

  const selectedBlockId = useSelectedBlockId();
  const isSelected = selectedBlockId === currentBlock?.id;

  const sanitizeConf = {
    allowedTags: [],
    allowedAttributes: {},
  };

  const onChange = useCallback(
    (value: string) => {
      dispatchAction({
        type: "set-block-data",
        value: {
          blockId: currentBlock.id,
          data: {
            ...currentBlock.data,
            props: {
              ...currentBlock.data?.props,
              text: sanitizeHtml(value, sanitizeConf),
            },
          },
        },
      });
    },
    [currentBlock]
  );

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    const { key } = e;
    if (key === "Enter") {
      e.preventDefault();
      ref?.current?.blur();
      setSelectedBlockId(null);
    }
  }, []);

  const className = generateClassName();
  const defaults = getDefaults({ props, style }, true);
  const base = currentBlock.base;

  return (
    <>
      <BlockStyle
        name={className}
        styleDefinitions={styles}
        styles={style}
        defaults={defaults}
        isEditor
      />
      <ArgumentsAutocomplete
        ref={ref}
        args={args}
        className={cn(
          "w-full bg-transparent border-0 focus-visible:ring-0 rounded-none h-auto p-0 border-none leading-normal",
          className,
          base?.className
        )}
        value={value ?? "Simple text"}
        onChange={onChange}
        onKeyDown={handleKeyPress}
        asContentEditable
        element={"span"}
        placeholder="Simple text"
        documentElement={document}
        style={
          {
            //// @ts-expect-error - TODO: remove this once we have a proper solution for this
            // fieldSizing: "content",
          }
        }
        id={base?.id}
      />
    </>
  );
}
