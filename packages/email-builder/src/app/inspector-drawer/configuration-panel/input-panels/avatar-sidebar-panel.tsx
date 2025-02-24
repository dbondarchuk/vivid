import { useState } from "react";

import {
  AvatarProps,
  AvatarPropsDefaults,
  AvatarPropsSchema,
} from "@usewaypoint/block-avatar";

import { Proportions } from "lucide-react";
import BaseSidebarPanel from "./helpers/base-sidebar-panel";
import RadioGroupInput from "./helpers/inputs/radio-group-input";
import { RadioGroupInputItem } from "./helpers/inputs/radio-group-input-item";
import SliderInput from "./helpers/inputs/slider-input";
import TextInput from "./helpers/inputs/text-input";
import MultiStylePropertyPanel from "./helpers/style-inputs/multi-style-property-panel";
import FileInput from "./helpers/inputs/file-input";

type AvatarSidebarPanelProps = {
  data: AvatarProps;
  setData: (v: AvatarProps) => void;
};
export default function AvatarSidebarPanel({
  data,
  setData,
}: AvatarSidebarPanelProps) {
  const [, setErrors] = useState<Zod.ZodError | null>(null);
  const updateData = (d: unknown) => {
    const res = AvatarPropsSchema.safeParse(d);
    if (res.success) {
      setData(res.data);
      setErrors(null);
    } else {
      setErrors(res.error);
    }
  };

  const size = data.props?.size ?? AvatarPropsDefaults.size;
  const imageUrl = data.props?.imageUrl ?? AvatarPropsDefaults.imageUrl;
  const alt = data.props?.alt ?? AvatarPropsDefaults.alt;
  const shape = data.props?.shape ?? AvatarPropsDefaults.shape;

  return (
    <BaseSidebarPanel title="Avatar block">
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
    </BaseSidebarPanel>
  );
}
