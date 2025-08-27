import { useI18n } from "@vivid/i18n";
import { Combobox } from "@vivid/ui";
import { Move } from "lucide-react";
import { z } from "zod";
import { StyleDefinition } from "../../types";

const transformKeys = [
  "none",
  "scale(0.5)",
  "scale(0.75)",
  "scale(1.25)",
  "scale(1.5)",
  "scale(2)",
  "rotate(45deg)",
  "rotate(90deg)",
  "rotate(180deg)",
  "rotate(-45deg)",
  "translateX(10px)",
  "translateY(10px)",
  "skewX(10deg)",
  "skewY(10deg)",
] as const;

const transformKeyMap = {
  none: "none",
  "scale(0.5)": "scale_0_5",
  "scale(0.75)": "scale_0_75",
  "scale(1.25)": "scale_1_25",
  "scale(1.5)": "scale_1_5",
  "scale(2)": "scale_2",
  "rotate(45deg)": "rotate_45deg",
  "rotate(90deg)": "rotate_90deg",
  "rotate(180deg)": "rotate_180deg",
  "rotate(-45deg)": "rotate_minus_45deg",
  "translateX(10px)": "translateX_10px",
  "translateY(10px)": "translateY_10px",
  "skewX(10deg)": "skewX_10deg",
  "skewY(10deg)": "skewY_10deg",
} as const;

const TransformSchema = z.enum(transformKeys);

export const transformStyle = {
  name: "transform",
  label: "pageBuilder.styles.properties.transform",
  category: "effects",
  schema: TransformSchema,
  icon: ({ className }) => <Move className={className} />,
  defaultValue: "none",
  renderToCSS: (value) => {
    if (!value || value === "none") return null;
    return `transform: ${value};`;
  },
  component: ({ value, onChange }) => {
    const t = useI18n("builder");

    return (
      <Combobox
        values={transformKeys.map((transform) => ({
          value: transform,
          label: t(
            `pageBuilder.styles.transform.${transformKeyMap[transform]}`,
          ),
        }))}
        value={value}
        onItemSelect={(val) => onChange(val as z.infer<typeof TransformSchema>)}
        className="w-full"
        size="sm"
      />
    );
  },
} as const satisfies StyleDefinition<typeof TransformSchema>;
