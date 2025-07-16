"use client";

import { ConfigurationProps } from "@vivid/builder";
import { StylesConfigurationPanel } from "../../configuration-panel/styles-configuration-panel";
import { SpacerProps } from "./schema";
import { styles } from "./styles";
import { spacerShortcuts } from "./shortcuts";

export const SpacerConfiguration = ({
  data,
  setData,
  base,
  onBaseChange,
}: ConfigurationProps<SpacerProps>) => {
  const updateData = (d: unknown) => setData(d as SpacerProps);

  return (
    <StylesConfigurationPanel
      shortcuts={spacerShortcuts}
      styles={data.style ?? {}}
      onStylesChange={(style) => updateData({ ...data, style })}
      availableStyles={styles}
      base={base}
      onBaseChange={onBaseChange}
    />
  );
};
