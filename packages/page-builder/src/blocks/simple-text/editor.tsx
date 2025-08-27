"use client";

import { useCallback, useRef } from "react";
import sanitizeHtml from "sanitize-html";

import {
  useCurrentBlock,
  useDispatchAction,
  useEditorArgs,
  useIsSelectedBlock,
  usePortalContext,
  useSetCurrentBlockRef,
  useSetSelectedBlockId,
} from "@vivid/builder";
import { useI18n } from "@vivid/i18n";
import { ArgumentsAutocomplete, cn, useDebounceCallback } from "@vivid/ui";
import { BlockStyle } from "../../helpers/styling";
import { useClassName } from "../../helpers/use-class-name";
import { SimpleTextProps } from "./schema";
import { getDefaults, styles } from "./styles";

export function SimpleTextEditor({ props, style }: SimpleTextProps) {
  const t = useI18n("builder");
  const ref = useRef<HTMLInputElement>(null);
  const args = useEditorArgs();
  const currentBlock = useCurrentBlock<SimpleTextProps>();
  const value = currentBlock?.data?.props?.text;
  const dispatchAction = useDispatchAction();
  const setSelectedBlockId = useSetSelectedBlockId();
  const setRef = useSetCurrentBlockRef();

  const { document } = usePortalContext();

  const isSelected = useIsSelectedBlock(currentBlock?.id);

  const sanitizeConf = {
    allowedTags: [],
    allowedAttributes: {},
  };

  const onChange = useDebounceCallback(
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
    [currentBlock, dispatchAction],
    300,
  );

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    const { key } = e;
    if (key === "Enter") {
      e.preventDefault();
      ref?.current?.blur();
      setSelectedBlockId(null);
    }
  }, []);

  const className = useClassName();
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
        ref={(el) => {
          ref.current = el as HTMLInputElement;
          setRef(el as any);
        }}
        args={args}
        className={cn(
          "w-full bg-transparent border-0 focus-visible:ring-0 rounded-none h-auto p-0 border-none leading-normal",
          isSelected && "px-1",
          className,
          base?.className,
        )}
        value={value ?? "Simple text"}
        onChange={onChange}
        onKeyDown={handleKeyPress}
        asContentEditable
        element={"span"}
        placeholder={t("pageBuilder.blocks.simpleText.placeholder")}
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
