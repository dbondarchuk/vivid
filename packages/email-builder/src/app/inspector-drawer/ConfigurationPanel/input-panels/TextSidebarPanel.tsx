import { useState } from "react";

import BaseSidebarPanel from "./helpers/BaseSidebarPanel";
import MultiStylePropertyPanel from "./helpers/style-inputs/MultiStylePropertyPanel";
import TextPropsSchema, {
  TextProps,
} from "../../../../documents/blocks/text/schema";

type TextSidebarPanelProps = {
  data: TextProps;
  setData: (v: TextProps) => void;
};
export default function TextSidebarPanel({
  data,
  setData,
}: TextSidebarPanelProps) {
  const [, setErrors] = useState<Zod.ZodError | null>(null);

  const updateData = (d: unknown) => {
    const res = TextPropsSchema.safeParse(d);
    if (res.success) {
      setData(res.data);
      setErrors(null);
    } else {
      setErrors(res.error);
    }
  };

  return (
    <BaseSidebarPanel title="Text block">
      <MultiStylePropertyPanel
        names={["color", "backgroundColor", "fontFamily", "padding"]}
        value={data.style}
        onChange={(style) => updateData({ ...data, style })}
      />
    </BaseSidebarPanel>
  );
}
