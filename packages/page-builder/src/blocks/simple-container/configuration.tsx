"use client";

import { ConfigurationProps } from "@vivid/builder";
import { StylesConfigurationPanel } from "../../configuration-panel/styles-configuration-panel";
import { SimpleContainerProps, styles } from "./schema";
import { containerShortcuts } from "./shortcuts";

export const SimpleContainerConfiguration = ({
  data,
  setData,
  base,
  onBaseChange,
}: ConfigurationProps<SimpleContainerProps>) => {
  const updateData = (d: unknown) => setData(d as SimpleContainerProps);

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
