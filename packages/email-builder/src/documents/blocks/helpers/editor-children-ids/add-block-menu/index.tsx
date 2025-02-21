import React from "react";

import { TEditorBlock } from "../../../../editor/core";

import { Popover, PopoverContent, PopoverTrigger } from "@vivid/ui";
import BlockButton from "./block-button";
import { BUTTONS } from "./buttons";
import DividerButton from "./divider-button";
import PlaceholderButton from "./placeholder-button";

type Props = {
  placeholder?: boolean;
  onSelect: (block: TEditorBlock) => void;
};
export default function AddBlockButton({ onSelect, placeholder }: Props) {
  const [open, setOpen] = React.useState(false);
  const onItemSelect = (block: TEditorBlock) => {
    onSelect(block);
    setOpen(false);
  };

  return (
    <Popover modal open={open} onOpenChange={setOpen}>
      {placeholder ? <PlaceholderButton /> : <DividerButton />}
      <PopoverContent className="sm:w-fit">
        <div className="p-1 flex flew-row flex-wrap md:grid md:grid-cols-4 gap-2">
          {BUTTONS.map((k, i) => (
            <BlockButton
              key={i}
              label={k.label}
              icon={k.icon}
              onClick={() => onItemSelect(k.block())}
            />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
