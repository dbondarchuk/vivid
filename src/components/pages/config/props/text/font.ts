import { ComponentConfig } from "@measured/puck";

export const FontOptions = [
  { value: "primary", label: "Primary", className: "font-primary" },
  { value: "secondary", label: "Secondary", className: "font-secondary" },
] as const;

export type FontValues = (typeof FontOptions)[number]["value"];

export type FontProps = {
  font?: FontValues;
};

export const FontField: ComponentConfig<FontProps>["fields"] = {
  font: {
    type: "select",
    label: "Font",
    options: FontOptions,
  },
} as const;

export const FontVariant = {
  font: FontOptions.reduce(
    (prev, curr) => ({ ...prev, [curr.value]: curr.className }),
    {} as Record<FontValues, string>
  ),
};

export const FontDefaults: FontProps = {
  font: "primary",
};
