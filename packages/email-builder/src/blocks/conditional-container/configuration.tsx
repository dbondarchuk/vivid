"use client";

import { ConfigurationProps, TextInput } from "@vivid/builder";
import { ConditionalContainerProps } from "./schema";

export const ConditionalContainerConfiguration = ({
  data,
  setData,
}: ConfigurationProps<ConditionalContainerProps>) => {
  const updateData = (d: unknown) => setData(d as ConditionalContainerProps);

  return (
    <>
      <TextInput
        label="Condition"
        defaultValue={data.props?.condition ?? ""}
        onChange={(condition) =>
          updateData({ ...data, props: { ...data.props, condition } })
        }
      />
    </>
  );
};
