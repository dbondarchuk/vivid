import { useI18n } from "@vivid/i18n";
import { Combobox } from "@vivid/ui";
import { LayoutGrid } from "lucide-react";
import { z } from "zod";
import { StyleDefinition } from "../../types";

const displayKeys = [
  "block",
  "inline",
  "inline-block",
  "flex",
  "grid",
  "none",
] as const;

const DisplaySchema = z.enum(displayKeys);

export const displayStyle = {
  name: "display",
  label: "pageBuilder.styles.properties.display",
  icon: ({ className }) => <LayoutGrid className={className} />,
  category: "layout",
  schema: DisplaySchema,
  defaultValue: "block",
  renderToCSS: (value: any) => {
    if (!value) return null;
    return `display: ${value};`;
  },
  component: ({ value, onChange }) => {
    const t = useI18n("builder");
    return (
      <Combobox
        values={displayKeys.map((display) => ({
          value: display,
          label: t(`pageBuilder.styles.display.${display}`),
        }))}
        value={value}
        onItemSelect={(val) => onChange(val as z.infer<typeof DisplaySchema>)}
        className="w-full"
        size="sm"
      />
    );
  },
} as const satisfies StyleDefinition<typeof DisplaySchema>;
