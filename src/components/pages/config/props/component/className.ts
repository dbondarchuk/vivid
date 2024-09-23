import { ComponentConfig } from "@measured/puck";

export type ClassNameProps = {
  className?: string;
};

export const ClassNameFields: ComponentConfig<ClassNameProps>["fields"] = {
  className: {
    type: "text",
    label: "Additional classes",
  },
} as const;

export const ClassNameDefaults: ClassNameProps = {};

export const ClassNameClasses = (props: ClassNameProps) =>
  props.className ? [props.className] : [];
