"use client";

import { ColumnsContainerProps } from "./schema";

import {
  ConfigurationProps,
  RadioGroupInput,
  RadioGroupInputItem,
  SliderInput,
} from "@vivid/builder";
import {
  ArrowDownToLine,
  ArrowUpToLine,
  BetweenVerticalStart,
  FoldVertical,
} from "lucide-react";
import { MultiStylePropertyPanel } from "../../style-inputs/multi-style-property-panel";
import { ColumnWidthsInput } from "./column-widths-input";

export const ColumnsContainerConfiguration = ({
  data,
  setData,
}: ConfigurationProps<ColumnsContainerProps>) => {
  const updateData = (d: unknown) => setData(d as ColumnsContainerProps);

  return (
    <>
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
    </>
  );
};
