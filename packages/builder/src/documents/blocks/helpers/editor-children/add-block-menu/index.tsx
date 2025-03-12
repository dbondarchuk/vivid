import React, { Fragment } from "react";

import { TEditorBlock } from "../../../../editor/core";

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
import { useBlocks, useRootBlock } from "../../../../editor/context";
import { generateId } from "../../../../helpers/block-id";
import { BlockTypeButton } from "./block-button";
import { DividerButton } from "./divider-button";
import { PlaceholderButton } from "./placeholder-button";

type Props = {
  onSelect: (block: TEditorBlock) => void;
} & (
  | {
      placeholder: true;
      contextId: string;
    }
  | {
      placeholder?: false;
    }
);

export const AddBlockButton: React.FC<Props> = ({ onSelect, ...rest }) => {
  const [open, setOpen] = React.useState(false);
  const blocks = useBlocks();
  const rootBlock = useRootBlock();

  const onItemSelect = (block: Omit<TEditorBlock, "id">) => {
    onSelect({
      ...block,
      id: generateId(),
    });

    setOpen(false);
  };

  type block = (typeof blocks)[string] & { name: string };
  return (
    <Popover modal open={open} onOpenChange={setOpen}>
      {rest.placeholder ? (
        <PlaceholderButton contextId={rest.contextId} />
      ) : (
        <DividerButton />
      )}
      <PopoverContent className="sm:w-fit">
        <Command>
          <CommandInput placeholder="Search blocks..." />
          <CommandList>
            <CommandEmpty>No results found</CommandEmpty>
            {Object.entries(
              Object.entries(blocks)
                .filter(([type]) => rootBlock.type !== type)
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
                  {} as Record<string, block[]>
                )
            ).map(([category, values], i, array) => (
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
                <CommandGroup heading={category}>
                  {values.map(({ name, defaultValue, icon, displayName }) => (
                    <CommandItem
                      key={name}
                      className="gap-2 [&>svg]:size-4"
                      onSelect={() =>
                        onItemSelect({
                          type: name,
                          data: defaultValue,
                        })
                      }
                    >
                      {icon} {displayName}
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
