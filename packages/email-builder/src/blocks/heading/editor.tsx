"use client";

import { useRef } from "react";
import sanitizeHtml from "sanitize-html";

import { ArgumentsAutocomplete } from "@vivid/ui";
import { getStyles } from "./styles";
import {
  useEditorArgs,
  useCurrentBlock,
  useDispatchAction,
  useSetSelectedBlockId,
  usePortalContext,
} from "@vivid/builder";
import { HeadingProps } from "./schema";

export function HeadingEditor({ props, style }: HeadingProps) {
  const ref = useRef<HTMLInputElement>(null);
  const args = useEditorArgs();
  const currentBlock = useCurrentBlock<HeadingProps>();
  const value = currentBlock.data?.props?.text;
  const dispatchAction = useDispatchAction();
  const setSelectedBlockId = useSetSelectedBlockId();

  const { document } = usePortalContext();

  const styles = getStyles({ props, style });

  const sanitizeConf = {
    allowedTags: [],
    allowedAttributes: {},
  };

  const onChange = (value: string) => {
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
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    const { key } = e;
    if (key === "Enter") {
      e.preventDefault();
      ref?.current?.blur();
      setSelectedBlockId(null);
    }
  };

  return (
    <ArgumentsAutocomplete
      ref={ref}
      args={args}
      asInput
      className="w-full bg-transparent border-0 focus-visible:ring-0 rounded-none h-auto p-0 border-none leading-normal md:leading-normal"
      style={styles}
      value={value ?? "Heading"}
      onChange={onChange}
      onKeyDown={handleKeyPress}
      documentElement={document}
    />
  );
}
