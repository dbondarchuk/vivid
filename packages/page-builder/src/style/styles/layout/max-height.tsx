import { RulerDimensionLine } from "lucide-react";
import { RawNumberInputWithUnitsAndKeywords } from "../../../style-inputs/base/raw-number-input-with-units-and-keywords";
import { widthOrHeightOptions } from "../../../style-inputs/base/types";
import { StyleDefinition } from "../../types";
import { getZNumberValueWithUnitOrKeyword } from "../../zod";
import { renderRawNumberWithUnitOrKeywordCss } from "../../utils";

const MaxHeightSchema = getZNumberValueWithUnitOrKeyword(
  widthOrHeightOptions.map((option) => option.value)
);

export const maxHeightStyle = {
  name: "maxHeight",
  label: "pageBuilder.styles.properties.maxHeight",
  category: "layout",
  schema: MaxHeightSchema,
  icon: ({ className }) => <RulerDimensionLine className={className} />,
  defaultValue: { value: 100, unit: "%" },
  renderToCSS: (value) => {
    if (!value) return null;
    return `max-height: ${renderRawNumberWithUnitOrKeywordCss(value)};`;
  },
  component: ({ value, onChange }) => (
    <RawNumberInputWithUnitsAndKeywords
      icon={<RulerDimensionLine className="size-4" />}
      value={value}
      onChange={onChange}
      keywords={widthOrHeightOptions}
    />
  ),
} as const satisfies StyleDefinition<typeof MaxHeightSchema>;
