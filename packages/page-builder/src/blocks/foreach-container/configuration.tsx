"use client";

import { ConfigurationProps, TextInput } from "@vivid/builder";
import { useI18n } from "@vivid/i18n";
import { deepMemo } from "@vivid/ui";
import { useCallback } from "react";
import { ForeachContainerProps } from "./schema";

export const ForeachContainerConfiguration = deepMemo(
  ({ data, setData }: ConfigurationProps<ForeachContainerProps>) => {
    const updateProps = useCallback(
      (p: unknown) =>
        setData({ ...data, props: p as ForeachContainerProps["props"] }),
      [setData, data],
    );
    const t = useI18n("builder");
    return (
      <>
        <TextInput
          label={t("pageBuilder.blocks.foreachContainer.value")}
          defaultValue={data.props?.value ?? ""}
          onChange={(value) => updateProps({ ...data.props, value })}
        />
      </>
    );
  },
);
