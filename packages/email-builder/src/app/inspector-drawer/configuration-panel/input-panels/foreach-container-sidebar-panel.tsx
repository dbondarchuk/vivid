import React, { useState } from "react";

import ForeachContainerPropsSchema, {
  ForeachContainerProps,
} from "../../../../documents/blocks/foreach-container/schema";

import BaseSidebarPanel from "./helpers/base-sidebar-panel";
import MultiStylePropertyPanel from "./helpers/style-inputs/multi-style-property-panel";
import TextInput from "./helpers/inputs/text-input";

type ForeachContainerSidebarPanelProps = {
  data: ForeachContainerProps;
  setData: (v: ForeachContainerProps) => void;
};

export default function ForeachContainerSidebarPanel({
  data,
  setData,
}: ForeachContainerSidebarPanelProps) {
  const [, setErrors] = useState<Zod.ZodError | null>(null);
  const updateData = (d: unknown) => {
    const res = ForeachContainerPropsSchema.safeParse(d);
    if (res.success) {
      setData(res.data);
      setErrors(null);
    } else {
      setErrors(res.error);
    }
  };
  return (
    <BaseSidebarPanel title="For each container block">
      <TextInput
        label="Value"
        defaultValue={data.props?.value ?? ""}
        onChange={(value) =>
          updateData({ ...data, props: { ...data.props, value } })
        }
      />
    </BaseSidebarPanel>
  );
}
