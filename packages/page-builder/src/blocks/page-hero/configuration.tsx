"use client";

import { ConfigurationProps } from "@vivid/builder";
import { StylesConfigurationPanel } from "../../configuration-panel/styles-configuration-panel";
import { PageHeroProps } from "./schema";
import { pageHeroShortcuts } from "./shortcuts";
import { styles } from "./styles";
import { deepMemo } from "@vivid/ui";
import { useCallback } from "react";

export const PageHeroConfiguration = deepMemo(
  ({
    data,
    setData,
    base,
    onBaseChange,
  }: ConfigurationProps<PageHeroProps>) => {
    const updateStyle = useCallback(
      (s: unknown) => setData({ ...data, style: s as PageHeroProps["style"] }),
      [setData, data]
    );

    return (
      <StylesConfigurationPanel
        styles={data.style ?? {}}
        onStylesChange={updateStyle}
        availableStyles={styles}
        shortcuts={pageHeroShortcuts}
        base={base}
        onBaseChange={onBaseChange}
      />
    );
  }
);
