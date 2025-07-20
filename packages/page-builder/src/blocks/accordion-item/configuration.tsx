"use client";

import { ConfigurationProps } from "@vivid/builder";
import { useI18n } from "@vivid/i18n";
import { StylesConfigurationPanel } from "../../configuration-panel/styles-configuration-panel";
import { AccordionItemProps } from "./schema";
import { styles } from "./styles";

export const AccordionItemConfiguration = ({
  data,
  setData,
  base,
  onBaseChange,
}: ConfigurationProps<AccordionItemProps>) => {
  const updateData = (d: unknown) => setData(d as AccordionItemProps);
  const t = useI18n("builder");

  return (
    <StylesConfigurationPanel
      styles={data.style ?? {}}
      onStylesChange={(style) => updateData({ ...data, style })}
      availableStyles={styles}
      base={base}
      onBaseChange={onBaseChange}
    />
  );
};
