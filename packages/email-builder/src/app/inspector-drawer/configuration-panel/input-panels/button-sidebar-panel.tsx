import React, { useState } from "react";

import {
  ButtonProps,
  ButtonPropsDefaults,
  ButtonPropsSchema,
} from "@usewaypoint/block-button";

import BaseSidebarPanel from "./helpers/base-sidebar-panel";
import ColorInput from "./helpers/inputs/color-input";
import RadioGroupInput from "./helpers/inputs/radio-group-input";
import TextInput from "./helpers/inputs/text-input";
import MultiStylePropertyPanel from "./helpers/style-inputs/multi-style-property-panel";
import { RadioGroupInputItem } from "./helpers/inputs/radio-group-input-item";

type ButtonSidebarPanelProps = {
  data: ButtonProps;
  setData: (v: ButtonProps) => void;
};
export default function ButtonSidebarPanel({
  data,
  setData,
}: ButtonSidebarPanelProps) {
  const [, setErrors] = useState<Zod.ZodError | null>(null);

  const updateData = (d: unknown) => {
    const res = ButtonPropsSchema.safeParse(d);
    if (res.success) {
      setData(res.data);
      setErrors(null);
    } else {
      setErrors(res.error);
    }
  };

  const text = data.props?.text ?? ButtonPropsDefaults.text;
  const url = data.props?.url ?? ButtonPropsDefaults.url;
  const fullWidth = data.props?.fullWidth ?? ButtonPropsDefaults.fullWidth;
  const size = data.props?.size ?? ButtonPropsDefaults.size;
  const buttonStyle =
    data.props?.buttonStyle ?? ButtonPropsDefaults.buttonStyle;
  const buttonTextColor =
    data.props?.buttonTextColor ?? ButtonPropsDefaults.buttonTextColor;
  const buttonBackgroundColor =
    data.props?.buttonBackgroundColor ??
    ButtonPropsDefaults.buttonBackgroundColor;

  return (
    <BaseSidebarPanel title="Button block">
      <TextInput
        label="Text"
        defaultValue={text}
        onChange={(text) =>
          updateData({ ...data, props: { ...data.props, text } })
        }
      />
      <TextInput
        label="Url"
        defaultValue={url}
        onChange={(url) =>
          updateData({ ...data, props: { ...data.props, url } })
        }
      />
      <RadioGroupInput
        label="Width"
        defaultValue={fullWidth ? "FULL_WIDTH" : "AUTO"}
        onChange={(v) =>
          updateData({
            ...data,
            props: { ...data.props, fullWidth: v === "FULL_WIDTH" },
          })
        }
      >
        <RadioGroupInputItem value="FULL_WIDTH">Full</RadioGroupInputItem>
        <RadioGroupInputItem value="AUTO">Auto</RadioGroupInputItem>
      </RadioGroupInput>
      <RadioGroupInput
        label="Size"
        defaultValue={size}
        onChange={(size) =>
          updateData({ ...data, props: { ...data.props, size } })
        }
      >
        <RadioGroupInputItem value="x-small">Xs</RadioGroupInputItem>
        <RadioGroupInputItem value="small">Sm</RadioGroupInputItem>
        <RadioGroupInputItem value="medium">Md</RadioGroupInputItem>
        <RadioGroupInputItem value="large">Lg</RadioGroupInputItem>
      </RadioGroupInput>
      <RadioGroupInput
        label="Style"
        defaultValue={buttonStyle}
        onChange={(buttonStyle) =>
          updateData({ ...data, props: { ...data.props, buttonStyle } })
        }
      >
        <RadioGroupInputItem value="rectangle">Rectangle</RadioGroupInputItem>
        <RadioGroupInputItem value="rounded">Rounded</RadioGroupInputItem>
        <RadioGroupInputItem value="pill">Pill</RadioGroupInputItem>
      </RadioGroupInput>
      <ColorInput
        label="Text color"
        defaultValue={buttonTextColor}
        onChange={(buttonTextColor) =>
          updateData({ ...data, props: { ...data.props, buttonTextColor } })
        }
      />
      <ColorInput
        label="Button color"
        defaultValue={buttonBackgroundColor}
        onChange={(buttonBackgroundColor) =>
          updateData({
            ...data,
            props: { ...data.props, buttonBackgroundColor },
          })
        }
      />
      <MultiStylePropertyPanel
        names={[
          "backgroundColor",
          "fontFamily",
          "fontSize",
          "fontWeight",
          "textAlign",
          "padding",
        ]}
        value={data.style}
        onChange={(style) => updateData({ ...data, style })}
      />
    </BaseSidebarPanel>
  );
}
