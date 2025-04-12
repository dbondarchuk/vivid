import React, { CSSProperties } from "react";
import { TextareaMentions } from "./textarea-mention";
import { propertiesToArray } from "@vivid/utils";
import { TextareaProps } from "./textarea";

export type ArgumentsAutocompleteProps = Omit<TextareaProps, "onChange"> & {
  args?: Record<string, any>;
  asInput?: boolean;
  value?: string;
  onChange?: (value: string) => void;
};

export const ArgumentsAutocomplete = React.forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  ArgumentsAutocompleteProps
>(({ args, asInput, value, onChange, ...rest }, ref) => {
  const argsData = args ? propertiesToArray(args) : [];

  return (
    <TextareaMentions
      ref={ref}
      trigger="{{"
      asInput={asInput}
      data={argsData}
      value={value || ""}
      onChange={onChange}
      insertTransform={(value) => {
        if (value.display === "[]") {
          return `{{#${value.id}}}{{.}}{{/${value.id}}}`;
        }

        return `{{${value.id}}}`;
      }}
      itemRenderer={(item) => (
        <div className="flex flex-col gap2">
          {item.id}
          <span className="text-xs text-muted-foreground">{item.display}</span>
        </div>
      )}
      {...rest}
    />
  );
});
