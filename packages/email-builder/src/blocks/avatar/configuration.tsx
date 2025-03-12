"use client";

import {
  ConfigurationProps,
  FileInput,
  RadioGroupInput,
  RadioGroupInputItem,
  SliderInput,
  TextInput,
} from "@vivid/builder";
import { Proportions } from "lucide-react";
import { MultiStylePropertyPanel } from "../../style-inputs/multi-style-property-panel";
import { AvatarProps, AvatarPropsDefaults } from "./schema";

export const AvatarConfiguration = ({
  data,
  setData,
}: ConfigurationProps<AvatarProps>) => {
  const updateData = (d: unknown) => setData(d as AvatarProps);

  const size = data.props?.size ?? AvatarPropsDefaults.props.size;
  const imageUrl = data.props?.imageUrl ?? AvatarPropsDefaults.props.imageUrl;
  const alt = data.props?.alt ?? AvatarPropsDefaults.props.alt;
  const shape = data.props?.shape ?? AvatarPropsDefaults.props.shape;

  return (
    <>
      <SliderInput
        label="Size"
        iconLabel={<Proportions className="text-secondary-foreground" />}
        units="px"
        step={3}
        min={32}
        max={256}
        defaultValue={size}
        onChange={(size) => {
          updateData({ ...data, props: { ...data.props, size } });
        }}
      />
      <RadioGroupInput
        label="Shape"
        defaultValue={shape}
        onChange={(shape) => {
          updateData({ ...data, props: { ...data.props, shape } });
        }}
      >
        <RadioGroupInputItem value="circle">Circle</RadioGroupInputItem>
        <RadioGroupInputItem value="square">Square</RadioGroupInputItem>
        <RadioGroupInputItem value="rounded">Rounded</RadioGroupInputItem>
      </RadioGroupInput>
      <FileInput
        label="Image URL"
        accept="image/*"
        defaultValue={imageUrl ?? ""}
        onChange={(v) => {
          const url = v.trim().length === 0 ? null : v.trim();
          updateData({ ...data, props: { ...data.props, imageUrl: url } });
        }}
      />
      <TextInput
        label="Alt text"
        defaultValue={alt}
        onChange={(alt) => {
          updateData({ ...data, props: { ...data.props, alt } });
        }}
      />

      <MultiStylePropertyPanel
        names={["textAlign", "padding"]}
        value={data.style}
        onChange={(style) => updateData({ ...data, style })}
      />
    </>
  );
};
