import { Clock } from "lucide-react";
import { Combobox } from "@vivid/ui";
import { useI18n } from "@vivid/i18n";
import { StyleDefinition } from "../../types";
import { z } from "zod";

const transitionKeys = [
  "none",
  "all 0.2s ease",
  "all 0.3s ease",
  "all 0.5s ease",
  "all 0.2s ease-in",
  "all 0.2s ease-out",
  "all 0.2s ease-in-out",
  "opacity 0.2s ease",
  "transform 0.2s ease",
  "background-color 0.2s ease",
  "color 0.2s ease",
  "border-color 0.2s ease",
  "filter 0.2s ease",
  "filter 0.5s ease",
] as const;

const transitionKeyMap = {
  none: "none",
  "all 0.2s ease": "all_0_2s_ease",
  "all 0.3s ease": "all_0_3s_ease",
  "all 0.5s ease": "all_0_5s_ease",
  "all 0.2s ease-in": "all_0_2s_ease_in",
  "all 0.2s ease-out": "all_0_2s_ease_out",
  "all 0.2s ease-in-out": "all_0_2s_ease_in_out",
  "opacity 0.2s ease": "opacity_0_2s_ease",
  "transform 0.2s ease": "transform_0_2s_ease",
  "background-color 0.2s ease": "background_color_0_2s_ease",
  "color 0.2s ease": "color_0_2s_ease",
  "border-color 0.2s ease": "border_color_0_2s_ease",
  "filter 0.2s ease": "filter_0_2s_ease",
  "filter 0.5s ease": "filter_0_5s_ease",
} as const;

const TransitionSchema = z.enum(transitionKeys);

export const transitionStyle = {
  name: "transition",
  label: "pageBuilder.styles.properties.transition",
  category: "effects",
  schema: TransitionSchema,
  icon: ({ className }) => <Clock className={className} />,
  defaultValue: "none",
  renderToCSS: (value) => {
    if (!value || value === "none") return null;
    return `transition: ${value};`;
  },
  component: ({ value, onChange }) => {
    const t = useI18n("builder");

    return (
      <Combobox
        values={transitionKeys.map((transition) => ({
          value: transition,
          label: t(
            `pageBuilder.styles.transition.${transitionKeyMap[transition]}`
          ),
        }))}
        value={value}
        onItemSelect={(val) =>
          onChange(val as z.infer<typeof TransitionSchema>)
        }
        className="w-full"
        size="sm"
      />
    );
  },
} as const satisfies StyleDefinition<typeof TransitionSchema>;
