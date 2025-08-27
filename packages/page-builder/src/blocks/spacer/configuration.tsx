"use client";

import { ConfigurationProps } from "@vivid/builder";
import { deepMemo } from "@vivid/ui";
import { useCallback } from "react";
import { StylesConfigurationPanel } from "../../configuration-panel/styles-configuration-panel";
import { SpacerProps } from "./schema";
import { spacerShortcuts } from "./shortcuts";
import { styles } from "./styles";

export const SpacerConfiguration = deepMemo(
  ({ data, setData, base, onBaseChange }: ConfigurationProps<SpacerProps>) => {
    const updateStyle = useCallback(
      (s: unknown) => setData({ ...data, style: s as SpacerProps["style"] }),
      [setData, data],
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
  },
);
