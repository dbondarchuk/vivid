"use client";

import { ConfigurationProps } from "@vivid/builder";
import { deepMemo } from "@vivid/ui";
import { StylesConfigurationPanel } from "../../configuration-panel/styles-configuration-panel";
import { ContainerProps, styles } from "./schema";
import { containerShortcuts } from "./shortcuts";
import { useCallback } from "react";

export const ContainerConfiguration = deepMemo(
  ({
    data,
    setData,
    base,
    onBaseChange,
  }: ConfigurationProps<ContainerProps>) => {
    const updateStyle = useCallback(
      (s: unknown) => setData({ ...data, style: s as ContainerProps["style"] }),
      [setData, data]
    );

    return (
      <StylesConfigurationPanel
        styles={data.style ?? {}}
        onStylesChange={updateStyle}
        availableStyles={styles}
        shortcuts={containerShortcuts}
        base={base}
        onBaseChange={onBaseChange}
      />
    );
  }
);
