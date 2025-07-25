"use client";

import { ConfigurationProps } from "@vivid/builder";
import { StylesConfigurationPanel } from "../../configuration-panel/styles-configuration-panel";
import { GridContainerProps, styles } from "./schema";
import { gridContainerShortcuts } from "./shortcuts";

export const GridContainerConfiguration = ({
  data,
  setData,
  base,
  onBaseChange,
}: ConfigurationProps<GridContainerProps>) => {
  const updateData = (d: unknown) => setData(d as GridContainerProps);

  return (
    <StylesConfigurationPanel
      styles={data.style ?? {}}
      onStylesChange={(style) => updateData({ ...data, style })}
      availableStyles={styles}
      shortcuts={gridContainerShortcuts}
      base={base}
      onBaseChange={onBaseChange}
    />
  );
};
