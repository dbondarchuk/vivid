import React, { Fragment, useMemo } from "react";

import { TEditorBlock } from "../../../../editor/core";

import { BuilderKeys, useI18n } from "@vivid/i18n";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  Popover,
  PopoverContent,
} from "@vivid/ui";
import { useBlocks, useRootBlockType } from "../../../../editor/context";
import { generateId } from "../../../../helpers/block-id";
import { BaseZodDictionary } from "../../../../types";
import { DividerButton } from "./divider-button";
import { PlaceholderButton } from "./placeholder-button";

type Props<T extends BaseZodDictionary = any> = {
  onSelect: (block: TEditorBlock) => void;
  allowOnly?: (keyof T)[];
  currentBlock: keyof T;
  size?: "small" | "default";
} & (
  | {
      disabledDroppable?: boolean;
      placeholder: true;
      contextId: string;
      isOver?: boolean;
      className?: string;
    }
  | {
      placeholder?: false;
    }
);

export const AddBlockButton = <T extends BaseZodDictionary = any>({
  onSelect,
  allowOnly,
  currentBlock,
  size,
  ...rest
}: Props<T>) => {
  const [open, setOpen] = React.useState(false);
  const blocks = useBlocks();
  const rootBlockType = useRootBlockType();
  const t = useI18n("builder");
  const tUi = useI18n("ui");

  const onItemSelect = (block: Omit<TEditorBlock, "id">) => {
    onSelect({
      ...block,
      id: generateId(),
    });

    setOpen(false);
  };

  type block = (typeof blocks)[string] & { name: string };
  const filteredBlocks = useMemo(() => {
    return Object.entries(
      Object.entries(blocks)
        .filter(
          ([type]) =>
            (allowOnly
              ? Array.isArray(allowOnly)
                ? allowOnly.includes(type as keyof T)
                : type === allowOnly
              : rootBlockType !== type) &&
            (!blocks[type].allowedIn ||
              blocks[type].allowedIn.includes(currentBlock)),
        )
        .reduce(
          (map, [name, value]) => ({
            ...map,
            [value.category]: [
              ...(map[value.category] || []),
              {
                ...value,
                name,
              },
            ],
          }),
          {} as Record<string, block[]>,
        ),
    );
  }, [blocks, allowOnly, currentBlock, rootBlockType]);

  return (
    <Popover modal open={open} onOpenChange={setOpen}>
      {rest.placeholder ? (
        <PlaceholderButton
          contextId={rest.contextId}
          isOver={rest.isOver}
          className={rest.className}
          disabledDroppable={rest.disabledDroppable}
          size={size}
        />
      ) : (
        <DividerButton size={size} />
      )}
      <PopoverContent className="sm:w-fit">
        <Command>
          <CommandInput placeholder={t("baseBuilder.blocks.search")} />
          <CommandList>
            <CommandEmpty>{tUi("common.noResults")}</CommandEmpty>
            {filteredBlocks.map(([category, values], i, array) => (
              // <BlockTypeButton
              //   key={name}
              //   label={v.displayName}
              //   icon={v.icon}
              //   onClick={() =>
              //     onItemSelect({
              //       type: name,
              //       data: v.defaultValue,
              //     })
              //   }
              // />
              <Fragment key={category}>
                <CommandGroup heading={t(category as BuilderKeys)}>
                  {values.map(({ name, defaultValue, icon, displayName }) => (
                    <CommandItem
                      key={name}
                      className="cursor-pointer gap-2 [&>svg]:size-4"
                      onSelect={() =>
                        onItemSelect({
                          type: name,
                          data:
                            typeof defaultValue === "function"
                              ? defaultValue()
                              : defaultValue,
                        })
                      }
                    >
                      {icon} {t(displayName)}
                    </CommandItem>
                  ))}
                </CommandGroup>
                {i < array.length - 1 && <CommandSeparator />}
              </Fragment>
            ))}
          </CommandList>
        </Command>
        {/* <div className="p-1 flex flew-row flex-wrap md:grid md:grid-cols-4 gap-2">
          {Object.entries(blocks)
            .filter(([type]) => rootBlock.type !== type)
            .map(([name, v], i) => (
              <BlockTypeButton
                key={name}
                label={v.displayName}
                icon={v.icon}
                onClick={() =>
                  onItemSelect({
                    type: name,
                    data: v.defaultValue,
                  })
                }
              />
            ))}
        </div> */}
      </PopoverContent>
    </Popover>
  );
};
