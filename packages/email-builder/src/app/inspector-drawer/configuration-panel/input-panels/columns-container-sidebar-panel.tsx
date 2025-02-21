import React, { useState } from "react";

import ColumnsContainerPropsSchema, {
  ColumnsContainerProps,
} from "../../../../documents/blocks/columns-container/schema";

import BaseSidebarPanel from "./helpers/base-sidebar-panel";
import ColumnWidthsInput from "./helpers/inputs/column-widths-input";
import RadioGroupInput from "./helpers/inputs/radio-group-input";
import SliderInput from "./helpers/inputs/slider-input";
import MultiStylePropertyPanel from "./helpers/style-inputs/multi-style-property-panel";
import { RadioGroupInputItem } from "./helpers/inputs/radio-group-input-item";
import {
  ArrowDownToLine,
  ArrowUpToLine,
  BetweenVerticalStart,
  FoldVertical,
} from "lucide-react";

type ColumnsContainerPanelProps = {
  data: ColumnsContainerProps;
  setData: (v: ColumnsContainerProps) => void;
};
export default function ColumnsContainerPanel({
  data,
  setData,
}: ColumnsContainerPanelProps) {
  const [, setErrors] = useState<Zod.ZodError | null>(null);
  const updateData = (d: unknown) => {
    const res = ColumnsContainerPropsSchema.safeParse(d);
    if (res.success) {
      setData(res.data);
      setErrors(null);
    } else {
      setErrors(res.error);
    }
  };

  return (
    <BaseSidebarPanel title="Columns block">
      <RadioGroupInput
        label="Number of columns"
        defaultValue={data.props?.columnsCount === 2 ? "2" : "3"}
        onChange={(v) => {
          updateData({
            ...data,
            props: { ...data.props, columnsCount: v === "2" ? 2 : 3 },
          });
        }}
      >
        <RadioGroupInputItem value="2">2</RadioGroupInputItem>
        <RadioGroupInputItem value="3">3</RadioGroupInputItem>
      </RadioGroupInput>
      <ColumnWidthsInput
        columnsCount={data.props?.columnsCount || 3}
        defaultValue={data.props?.fixedWidths}
        onChange={(fixedWidths) => {
          updateData({ ...data, props: { ...data.props, fixedWidths } });
        }}
      />
      <SliderInput
        label="Columns gap"
        iconLabel={
          <BetweenVerticalStart className="text-secondary-foreground" />
        }
        units="px"
        step={4}
        min={0}
        max={80}
        defaultValue={data.props?.columnsGap ?? 0}
        onChange={(columnsGap) =>
          updateData({ ...data, props: { ...data.props, columnsGap } })
        }
      />
      <RadioGroupInput
        label="Alignment"
        defaultValue={data.props?.contentAlignment ?? "middle"}
        onChange={(contentAlignment) => {
          updateData({ ...data, props: { ...data.props, contentAlignment } });
        }}
      >
        <RadioGroupInputItem value="top">
          <ArrowUpToLine fontSize="small" /> Top
        </RadioGroupInputItem>
        <RadioGroupInputItem value="middle">
          <FoldVertical fontSize="small" /> Middle
        </RadioGroupInputItem>
        <RadioGroupInputItem value="bottom">
          <ArrowDownToLine fontSize="small" /> Bottom
        </RadioGroupInputItem>
      </RadioGroupInput>

      <MultiStylePropertyPanel
        names={["backgroundColor", "padding"]}
        value={data.style}
        onChange={(style) => updateData({ ...data, style })}
      />
    </BaseSidebarPanel>
  );
}
