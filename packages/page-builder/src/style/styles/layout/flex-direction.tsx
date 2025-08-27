import { useI18n } from "@vivid/i18n";
import { Combobox } from "@vivid/ui";
import { ArrowUpDown } from "lucide-react";
import { z } from "zod";
import { StyleDefinition } from "../../types";

const flexDirectionKeys = [
  "row",
  "row-reverse",
  "column",
  "column-reverse",
] as const;

const FlexDirectionSchema = z.enum(flexDirectionKeys);

export const flexDirectionStyle = {
  name: "flexDirection",
  label: "pageBuilder.styles.properties.flexDirection",
  category: "layout",
  schema: FlexDirectionSchema,
  icon: ({ className }) => <ArrowUpDown className={className} />,
  defaultValue: "row",
  renderToCSS: (value) => {
    if (!value) return null;
    return `flex-direction: ${value};`;
  },
  component: ({ value, onChange }) => {
    const t = useI18n("builder");

    return (
      <Combobox
        values={flexDirectionKeys.map((direction) => ({
          value: direction,
          label: t(`pageBuilder.styles.flexDirection.${direction}`),
        }))}
        value={value}
        onItemSelect={(val) =>
          onChange(val as z.infer<typeof FlexDirectionSchema>)
        }
        className="w-full"
        size="sm"
      />
    );
  },
} as const satisfies StyleDefinition<typeof FlexDirectionSchema>;
