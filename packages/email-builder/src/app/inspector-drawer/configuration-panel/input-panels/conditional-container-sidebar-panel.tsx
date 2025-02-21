import { useState } from "react";

import ConditionalContainerPropsSchema, {
  ConditionalContainerProps,
} from "../../../../documents/blocks/conditional-container/schema";

import BaseSidebarPanel from "./helpers/base-sidebar-panel";
import TextInput from "./helpers/inputs/text-input";

type ConditionalContainerSidebarPanelProps = {
  data: ConditionalContainerProps;
  setData: (v: ConditionalContainerProps) => void;
};

export default function ConditionalContainerSidebarPanel({
  data,
  setData,
}: ConditionalContainerSidebarPanelProps) {
  const [, setErrors] = useState<Zod.ZodError | null>(null);
  const updateData = (d: unknown) => {
    const res = ConditionalContainerPropsSchema.safeParse(d);
    if (res.success) {
      setData(res.data);
      setErrors(null);
    } else {
      setErrors(res.error);
    }
  };
  return (
    <BaseSidebarPanel title="Conditional container block">
      <TextInput
        label="Condition"
        defaultValue={data.props?.condition ?? ""}
        onChange={(condition) =>
          updateData({ ...data, props: { ...data.props, condition } })
        }
      />
    </BaseSidebarPanel>
  );
}
