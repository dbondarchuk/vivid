import { BuilderKeys, useI18n } from "@vivid/i18n";
import { Combobox } from "@vivid/ui";
import { Repeat } from "lucide-react";
import { z } from "zod";
import { StyleDefinition } from "../../types";

const options = [
  "repeat",
  "no-repeat",
  "repeat-x",
  "repeat-y",
  "space",
  "round",
  "initial",
  "inherit",
] as const;

const optionsMap: Record<(typeof options)[number], BuilderKeys> = {
  repeat: "pageBuilder.styles.backgroundRepeat.repeat",
  "no-repeat": "pageBuilder.styles.backgroundRepeat.no-repeat",
  "repeat-x": "pageBuilder.styles.backgroundRepeat.repeat-x",
  "repeat-y": "pageBuilder.styles.backgroundRepeat.repeat-y",
  space: "pageBuilder.styles.backgroundRepeat.space",
  round: "pageBuilder.styles.backgroundRepeat.round",
  initial: "pageBuilder.styles.backgroundRepeat.initial",
  inherit: "pageBuilder.styles.backgroundRepeat.inherit",
};

const BackgroundRepeatSchema = z.enum(options);

export const backgroundRepeatStyle = {
  name: "backgroundRepeat",
  label: "pageBuilder.styles.properties.backgroundRepeat",
  category: "background",
  icon: ({ className }) => <Repeat className={className} />,
  schema: BackgroundRepeatSchema,
  defaultValue: "repeat",
  renderToCSS: (value) => {
    if (!value) return null;
    return `background-repeat: ${value};`;
  },
  component: ({ value, onChange }) => {
    const t = useI18n("builder");

    return (
      <Combobox
        value={value}
        onItemSelect={(value) => onChange(value as (typeof options)[number])}
        values={options.map((option) => ({
          value: option,
          label: t(optionsMap[option]),
        }))}
        size="sm"
        className="w-full"
      />
    );
  },
} as const satisfies StyleDefinition<typeof BackgroundRepeatSchema>;
