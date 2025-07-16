"use client";

import { ConfigurationProps } from "@vivid/builder";
import { StylesConfigurationPanel } from "../../configuration-panel/styles-configuration-panel";
import { PageHeroProps } from "./schema";
import { pageHeroShortcuts } from "./shortcuts";
import { styles } from "./styles";

export const PageHeroConfiguration = ({
  data,
  setData,
  base,
  onBaseChange,
}: ConfigurationProps<PageHeroProps>) => {
  const updateData = (d: unknown) => setData(d as PageHeroProps);

  return (
    <StylesConfigurationPanel
      styles={data.style ?? {}}
      onStylesChange={(style) => updateData({ ...data, style })}
      availableStyles={styles}
      shortcuts={pageHeroShortcuts}
      base={base}
      onBaseChange={onBaseChange}
    />
  );
};
