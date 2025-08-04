"use client";

import { ConfigurationProps, TextInput } from "@vivid/builder";
import { ConditionalContainerProps } from "./schema";
import { useI18n } from "@vivid/i18n";
import { deepMemo } from "@vivid/ui";
import { useCallback } from "react";

export const ConditionalContainerConfiguration = deepMemo(
  ({ data, setData }: ConfigurationProps<ConditionalContainerProps>) => {
    const updateProps = useCallback(
      (p: unknown) =>
        setData({ ...data, props: p as ConditionalContainerProps["props"] }),
      [setData, data]
    );
    const t = useI18n("builder");

    return (
      <>
        <TextInput
          label={t("pageBuilder.blocks.conditionalContainer.condition")}
          defaultValue={data.props?.condition ?? ""}
          onChange={(condition) => updateProps({ ...data.props, condition })}
        />
      </>
    );
  }
);
