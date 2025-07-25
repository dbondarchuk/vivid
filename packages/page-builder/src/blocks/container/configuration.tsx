"use client";

import { ConfigurationProps } from "@vivid/builder";
import { StylesConfigurationPanel } from "../../configuration-panel/styles-configuration-panel";
import { ContainerProps, styles } from "./schema";
import { containerShortcuts } from "./shortcuts";

export const ContainerConfiguration = ({
  data,
  setData,
  base,
  onBaseChange,
}: ConfigurationProps<ContainerProps>) => {
  const updateData = (d: unknown) => setData(d as ContainerProps);

  return (
    <StylesConfigurationPanel
      styles={data.style ?? {}}
      onStylesChange={(style) => updateData({ ...data, style })}
      availableStyles={styles}
      shortcuts={containerShortcuts}
      base={base}
      onBaseChange={onBaseChange}
    />
  );
};
