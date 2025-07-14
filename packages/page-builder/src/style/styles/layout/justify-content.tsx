import { AlignHorizontalJustifyCenter } from "lucide-react";
import { Combobox } from "@vivid/ui";
import { useI18n } from "@vivid/i18n";
import { StyleDefinition } from "../../types";
import { z } from "zod";

const justifyContentKeys = [
  "flex-start",
  "flex-end",
  "center",
  "space-between",
  "space-around",
  "space-evenly",
] as const;

const JustifyContentSchema = z.enum(justifyContentKeys);

export const justifyContentStyle = {
  name: "justifyContent",
  label: "pageBuilder.styles.properties.justifyContent",
  category: "layout",
  schema: JustifyContentSchema,
  icon: ({ className }) => (
    <AlignHorizontalJustifyCenter className={className} />
  ),
  defaultValue: "flex-start",
  renderToCSS: (value) => {
    if (!value) return null;
    return `justify-content: ${value};`;
  },
  component: ({ value, onChange }) => {
    const t = useI18n("builder");

    return (
      <Combobox
        values={justifyContentKeys.map((justify) => ({
          value: justify,
          label: t(`pageBuilder.styles.justifyContent.${justify}`),
        }))}
        value={value}
        onItemSelect={(val) =>
          onChange(val as z.infer<typeof JustifyContentSchema>)
        }
        className="w-full"
        size="sm"
      />
    );
  },
} as const satisfies StyleDefinition<typeof JustifyContentSchema>;
