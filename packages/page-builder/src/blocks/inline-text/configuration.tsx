"use client";

import { ConfigurationProps } from "@vivid/builder";
import { deepMemo } from "@vivid/ui";
import { useCallback } from "react";
import { StylesConfigurationPanel } from "../../configuration-panel/styles-configuration-panel";
import { InlineTextProps } from "./schema";
import { inlineTextShortcuts } from "./shortcuts";
import { styles } from "./styles";

export const InlineTextConfiguration = deepMemo(
  ({
    data,
    setData,
    base,
    onBaseChange,
  }: ConfigurationProps<InlineTextProps>) => {
    const updateStyle = useCallback(
      (s: unknown) =>
        setData({ ...data, style: s as InlineTextProps["style"] }),
      [setData, data],
    );

    return (
      <StylesConfigurationPanel
        styles={data.style ?? {}}
        onStylesChange={updateStyle}
        availableStyles={styles}
        shortcuts={inlineTextShortcuts}
        base={base}
        onBaseChange={onBaseChange}
      >
        {/* <TextInput
        label={t("pageBuilder.blocks.InlineText.url")}
        defaultValue={data.props?.url ?? ""}
        onChange={(value) =>
          updateData({ ...data, props: { ...data.props, url: value } })
        }
      /> */}
      </StylesConfigurationPanel>
    );
  },
);
