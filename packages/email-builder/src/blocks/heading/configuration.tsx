"use client";

import {
  ConfigurationProps,
  RadioGroupInput,
  RadioGroupInputItem,
  TextInput,
} from "@vivid/builder";
import { MultiStylePropertyPanel } from "../../style-inputs/multi-style-property-panel";
import { HeadingProps, HeadingPropsDefaults } from "./schema";

export const HeadingConfiguration = ({
  data,
  setData,
}: ConfigurationProps<HeadingProps>) => {
  const updateData = (d: unknown) => setData(d as HeadingProps);

  return (
    <>
      <TextInput
        label="Content"
        rows={3}
        defaultValue={data.props?.text ?? HeadingPropsDefaults.props.text}
        onChange={(text) => {
          updateData({ ...data, props: { ...data.props, text } });
        }}
      />
      <RadioGroupInput
        label="Level"
        defaultValue={data.props?.level ?? HeadingPropsDefaults.props.level}
        onChange={(level) => {
          updateData({ ...data, props: { ...data.props, level } });
        }}
      >
        <RadioGroupInputItem value="h1">H1</RadioGroupInputItem>
        <RadioGroupInputItem value="h2">H2</RadioGroupInputItem>
        <RadioGroupInputItem value="h3">H3</RadioGroupInputItem>
      </RadioGroupInput>
      <MultiStylePropertyPanel
        names={[
          "color",
          "backgroundColor",
          "fontFamily",
          "fontWeight",
          "textAlign",
          "fontSize",
          "padding",
        ]}
        value={data.style}
        onChange={(style) => updateData({ ...data, style })}
      />
    </>
  );
};
