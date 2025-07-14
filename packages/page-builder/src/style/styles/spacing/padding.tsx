import { PanelLeftClose } from "lucide-react";
import { FourSideValuesInput } from "../../../style-inputs/four-side-values-input";
import { StyleDefinition } from "../../types";
import { renderFourSideValuesCss } from "../../utils";
import { zFourSideValues } from "../../zod";

const PaddingSchema = zFourSideValues;

export const paddingStyle = {
  name: "padding",
  label: "pageBuilder.styles.properties.padding",
  category: "spacing",
  schema: PaddingSchema,
  icon: ({ className }) => <PanelLeftClose className={className} />,
  defaultValue: {
    top: "auto",
    right: "auto",
    bottom: "auto",
    left: "auto",
  },
  renderToCSS: (value) => {
    if (!value) return null;
    return `padding: ${renderFourSideValuesCss(value)};`;
  },
  component: ({ value, onChange }) => (
    <FourSideValuesInput defaultValue={value} onChange={onChange} />
  ),
} as const satisfies StyleDefinition<typeof PaddingSchema>;
