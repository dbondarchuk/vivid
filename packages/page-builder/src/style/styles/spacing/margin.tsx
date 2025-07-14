import { PanelRightOpen } from "lucide-react";
import { FourSideValuesInput } from "../../../style-inputs/four-side-values-input";
import { StyleDefinition } from "../../types";
import { renderFourSideValuesCss } from "../../utils";
import { zFourSideValues } from "../../zod";

const MarginSchema = zFourSideValues;

export const marginStyle = {
  name: "margin",
  label: "pageBuilder.styles.properties.margin",
  category: "spacing",
  schema: MarginSchema,
  icon: ({ className }) => <PanelRightOpen className={className} />,
  defaultValue: {
    top: "auto",
    right: "auto",
    bottom: "auto",
    left: "auto",
  },
  renderToCSS: (value) => {
    if (!value) return null;
    return `margin: ${renderFourSideValuesCss(value)};`;
  },
  component: ({ value, onChange }) => (
    <FourSideValuesInput defaultValue={value} onChange={onChange} />
  ),
} as const satisfies StyleDefinition<typeof MarginSchema>;
