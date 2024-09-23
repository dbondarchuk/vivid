import { ComponentConfig } from "@measured/puck";

export const FontWeightOptions = [
  { value: "thin", label: "Thin", className: "font-thin" },
  { value: "extra-light", label: "Extra light", className: "font-extralight" },
  { value: "light", label: "Light", className: "font-light" },
  { value: "normal", label: "Normal", className: "font-normal" },
  { value: "medium", label: "Medium", className: "font-medium" },
  { value: "semibold", label: "Semibold", className: "font-semibold" },
  { value: "bold", label: "Bold", className: "font-bold" },
  { value: "extrabold", label: "Extra bold", className: "font-extrabold" },
  { value: "black", label: "Black", className: "font-black" },
] as const;

export type FontWeightValues = (typeof FontWeightOptions)[number]["value"];

export type FontWeightProps = {
  fontWeight?: FontWeightValues;
};

export const FontWeightField: ComponentConfig<FontWeightProps>["fields"] = {
  fontWeight: {
    type: "select",
    label: "Font weight",
    options: FontWeightOptions,
  },
} as const;

export const FontWeightVariant = {
  fontWeight: FontWeightOptions.reduce(
    (prev, curr) => ({ ...prev, [curr.value]: curr.className }),
    {} as Record<FontWeightValues, string>
  ),
};

export const FontWeightDefaults: FontWeightProps = {
  fontWeight: "normal",
};
