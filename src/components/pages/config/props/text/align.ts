import { ComponentConfig } from "@measured/puck";

export const TextAlignOptions = [
  { value: "left", label: "Left", className: "text-left" },
  { value: "center", label: "Center", className: "text-center" },
  { value: "right", label: "Right", className: "text-right" },
] as const;

export type TextAlignValues = (typeof TextAlignOptions)[number]["value"];

export type TextAlignProps = {
  textAlign?: TextAlignValues;
};

export const TextAlignField: ComponentConfig<TextAlignProps>["fields"] = {
  textAlign: {
    type: "select",
    label: "Align text",
    options: TextAlignOptions,
  },
} as const;

export const TextAlignVariant = {
  textAlign: TextAlignOptions.reduce(
    (prev, curr) => ({ ...prev, [curr.value]: curr.className }),
    {} as Record<TextAlignValues, string>
  ),
};

export const TextAlignDefaults: TextAlignProps = {
  textAlign: "left",
};
