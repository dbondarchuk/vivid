"use client";

import { ConfigurationProps } from "@vivid/builder";
import { StylesConfigurationPanel } from "../../configuration-panel/styles-configuration-panel";

import { TextProps } from "./schema";
import { styles } from "./styles";

export const TextConfiguration = ({
  data,
  setData,
  base,
  onBaseChange,
}: ConfigurationProps<TextProps>) => {
  const updateData = (d: unknown) => setData(d as TextProps);

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
