import { AlignVerticalJustifyCenter } from "lucide-react";
import { Combobox } from "@vivid/ui";
import { useI18n } from "@vivid/i18n";
import { StyleDefinition } from "../../types";
import { z } from "zod";

const alignItemsKeys = [
  "flex-start",
  "flex-end",
  "center",
  "baseline",
  "stretch",
] as const;

const AlignItemsSchema = z.enum(alignItemsKeys);

export const alignItemsStyle = {
  name: "alignItems",
  label: "pageBuilder.styles.properties.alignItems",
  category: "layout",
  schema: AlignItemsSchema,
  icon: ({ className }) => <AlignVerticalJustifyCenter className={className} />,
  defaultValue: "stretch",
  renderToCSS: (value) => {
    if (!value) return null;
    return `align-items: ${value};`;
  },
  component: ({ value, onChange }) => {
    const t = useI18n("builder");

    return (
      <Combobox
        values={alignItemsKeys.map((align) => ({
          value: align,
          label: t(`pageBuilder.styles.alignItems.${align}`),
        }))}
        value={value}
        onItemSelect={(val) =>
          onChange(val as z.infer<typeof AlignItemsSchema>)
        }
        className="w-full"
        size="sm"
      />
    );
  },
} as const satisfies StyleDefinition<typeof AlignItemsSchema>;
