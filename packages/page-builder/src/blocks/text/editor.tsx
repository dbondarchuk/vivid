"use client";

import {
  useCurrentBlock,
  useDispatchAction,
  usePortalContext,
} from "@vivid/builder";
import { PlateEditor } from "@vivid/rte";
import { cn, useDebounceCallback } from "@vivid/ui";
import { BlockStyle } from "../../helpers/styling";
import { useClassName } from "../../helpers/use-class-name";
import { TextProps } from "./schema";
import { getDefaults, styles } from "./styles";

export const TextEditor = ({ props, style }: TextProps) => {
  const currentBlock = useCurrentBlock<TextProps>();
  const value = currentBlock?.data?.props?.value;
  const dispatchAction = useDispatchAction();

  const onChange = useDebounceCallback(
    (value: any) => {
      dispatchAction({
        type: "set-block-data",
        value: {
          blockId: currentBlock.id,
          data: {
            ...currentBlock.data,
            props: {
              ...currentBlock.data?.props,
              value,
            },
          },
        },
      });
    },
    [dispatchAction, currentBlock],
    300
  );

  const className = useClassName();
  const { document } = usePortalContext();
  const defaults = getDefaults({ props, style }, true);
  const base = currentBlock?.base;

  return (
    <>
      <BlockStyle
        name={className}
        styleDefinitions={styles}
        styles={style}
        defaults={defaults}
        isEditor
      />
      <PlateEditor
        value={value ?? []}
        onChange={onChange}
        className={cn(
          "w-full bg-transparent border-0 focus-visible:ring-0 rounded-none h-auto p-0 border-none leading-normal md:leading-normal",
          className,
          base?.className
        )}
        id={base?.id}
        document={document}
      />
    </>
  );
};
