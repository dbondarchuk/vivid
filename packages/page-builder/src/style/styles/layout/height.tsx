import { Ruler } from "lucide-react";
import { RawNumberInputWithUnitsAndKeywords } from "../../../style-inputs/base/raw-number-input-with-units-and-keywords";
import { StyleDefinition } from "../../types";
import { getZNumberValueWithUnitOrKeyword } from "../../zod";
import { widthOrHeightOptions } from "../../../style-inputs/base/types";
import { renderRawNumberWithUnitOrKeywordCss } from "../../utils";

const HeightSchema = getZNumberValueWithUnitOrKeyword(
  widthOrHeightOptions.map((option) => option.value)
);

export const heightStyle = {
  name: "height",
  label: "pageBuilder.styles.properties.height",
  category: "layout",
  schema: HeightSchema,
  icon: ({ className }) => <Ruler className={className} />,
  defaultValue: { value: 100, unit: "%" },
  renderToCSS: (value) => {
    if (!value) return null;
    return `height: ${renderRawNumberWithUnitOrKeywordCss(value)};`;
  },
  component: ({ value, onChange }) => (
    <RawNumberInputWithUnitsAndKeywords
      icon={<Ruler className="size-4" />}
      value={value}
      onChange={onChange}
      keywords={widthOrHeightOptions}
    />
  ),
} as const satisfies StyleDefinition<typeof HeightSchema>;
