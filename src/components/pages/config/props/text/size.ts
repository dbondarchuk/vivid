import { ComponentConfig } from "@measured/puck";

export const TextSizeOptions = [
  { value: "4xl", label: "4XL", className: "text-4xl" },
  { value: "3xl", label: "3XL", className: "text-3xl" },
  { value: "2xl", label: "2XL", className: "text-2xl" },
  { value: "xl", label: "XL", className: "text-xl" },
  { value: "lg", label: "LG", className: "text-lg" },
  { value: "md", label: "MD", className: "text-md" },
  { value: "sm", label: "SM", className: "text-sm" },
  { value: "xs", label: "XS", className: "text-xs" },
] as const;

export type TextSizeValues = (typeof TextSizeOptions)[number]["value"];

export type TextSizeProps = {
  textSize?: TextSizeValues;
};

export const TextSizeField: ComponentConfig<TextSizeProps>["fields"] = {
  textSize: {
    type: "select",
    label: "Text size",
    options: TextSizeOptions,
  },
} as const;

export const TextSizeVariant = {
  textSize: TextSizeOptions.reduce(
    (prev, curr) => ({ ...prev, [curr.value]: curr.className }),
    {} as Record<TextSizeValues, string>
  ),
};

export const TextSizeDefaults: TextSizeProps = {
  textSize: "md",
};
