"use client";

import { ConfigurationProps } from "@vivid/builder";
import { deepMemo } from "@vivid/ui";
import { useCallback } from "react";
import { StylesConfigurationPanel } from "../../configuration-panel/styles-configuration-panel";
import { SimpleTextProps } from "./schema";
import { simpleTextShortcuts } from "./shortcuts";
import { styles } from "./styles";

export const SimpleTextConfiguration = deepMemo(
  ({
    data,
    setData,
    base,
    onBaseChange,
  }: ConfigurationProps<SimpleTextProps>) => {
    const updateStyle = useCallback(
      (s: unknown) =>
        setData({ ...data, style: s as SimpleTextProps["style"] }),
      [setData, data],
    );

    return (
      <StylesConfigurationPanel
        styles={data.style ?? {}}
        onStylesChange={updateStyle}
        availableStyles={styles}
        shortcuts={simpleTextShortcuts}
        base={base}
        onBaseChange={onBaseChange}
      >
        {/* <TextInput
        label={t("pageBuilder.blocks.simpleText.url")}
        defaultValue={data.props?.url ?? ""}
        onChange={(value) =>
          updateData({ ...data, props: { ...data.props, url: value } })
        }
      /> */}
      </StylesConfigurationPanel>
    );
  },
);
