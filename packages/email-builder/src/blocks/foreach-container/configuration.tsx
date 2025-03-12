"use client";

import { ConfigurationProps, TextInput } from "@vivid/builder";
import { ForeachContainerProps } from "./schema";

export const ForeachContainerConfiguration = ({
  data,
  setData,
}: ConfigurationProps<ForeachContainerProps>) => {
  const updateData = (d: unknown) => setData(d as ForeachContainerProps);

  return (
    <>
      <TextInput
        label="Value"
        defaultValue={data.props?.value ?? ""}
        onChange={(value) =>
          updateData({ ...data, props: { ...data.props, value } })
        }
      />
    </>
  );
};
