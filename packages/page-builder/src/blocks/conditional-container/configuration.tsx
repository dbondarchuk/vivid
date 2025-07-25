"use client";

import { ConfigurationProps, TextInput } from "@vivid/builder";
import { ConditionalContainerProps } from "./schema";
import { useI18n } from "@vivid/i18n";

export const ConditionalContainerConfiguration = ({
  data,
  setData,
}: ConfigurationProps<ConditionalContainerProps>) => {
  const updateData = (d: unknown) => setData(d as ConditionalContainerProps);
  const t = useI18n("builder");

  return (
    <>
      <TextInput
        label={t("pageBuilder.blocks.conditionalContainer.condition")}
        defaultValue={data.props?.condition ?? ""}
        onChange={(condition) =>
          updateData({ ...data, props: { ...data.props, condition } })
        }
      />
    </>
  );
};
