"use client";

import { ConfigurationProps } from "@vivid/builder";
import { useI18n } from "@vivid/i18n";
import { deepMemo } from "@vivid/ui";
import { useCallback } from "react";
import { StylesConfigurationPanel } from "../../configuration-panel/styles-configuration-panel";
import { AccordionItemProps } from "./schema";
import { styles } from "./styles";

export const AccordionItemConfiguration = deepMemo(
  ({
    data,
    setData,
    base,
    onBaseChange,
  }: ConfigurationProps<AccordionItemProps>) => {
    const updateStyle = useCallback(
      (s: unknown) =>
        setData({ ...data, style: s as AccordionItemProps["style"] }),
      [setData, data]
    );

    return (
      <StylesConfigurationPanel
        styles={data.style ?? {}}
        onStylesChange={updateStyle}
        availableStyles={styles}
        base={base}
        onBaseChange={onBaseChange}
      />
    );
  }
);
