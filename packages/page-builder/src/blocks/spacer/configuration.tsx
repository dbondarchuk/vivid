"use client";

import { ConfigurationProps } from "@vivid/builder";
import { StylesConfigurationPanel } from "../../configuration-panel/styles-configuration-panel";
import { SpacerProps } from "./schema";
import { styles } from "./styles";
import { spacerShortcuts } from "./shortcuts";
import { deepMemo } from "@vivid/ui";
import { useCallback } from "react";

export const SpacerConfiguration = deepMemo(
  ({ data, setData, base, onBaseChange }: ConfigurationProps<SpacerProps>) => {
    const updateStyle = useCallback(
      (s: unknown) => setData({ ...data, style: s as SpacerProps["style"] }),
      [setData, data]
    );

    return (
      <StylesConfigurationPanel
        shortcuts={spacerShortcuts}
        styles={data.style ?? {}}
        onStylesChange={updateStyle}
        availableStyles={styles}
        base={base}
        onBaseChange={onBaseChange}
      />
    );
  }
);
