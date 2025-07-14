"use client";

import { ConfigurationProps, TextInput } from "@vivid/builder";
import { useI18n } from "@vivid/i18n";
import { ForeachContainerProps } from "./schema";

export const ForeachContainerConfiguration = ({
  data,
  setData,
}: ConfigurationProps<ForeachContainerProps>) => {
  const updateData = (d: unknown) => setData(d as ForeachContainerProps);
  const t = useI18n("builder");
  return (
    <>
      <TextInput
        label={t("pageBuilder.blocks.foreachContainer.value")}
        defaultValue={data.props?.value ?? ""}
        onChange={(value) =>
          updateData({ ...data, props: { ...data.props, value } })
        }
      />
    </>
  );
};
