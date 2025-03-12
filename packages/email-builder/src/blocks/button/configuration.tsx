"use client";

import {
  ColorInput,
  ConfigurationProps,
  RadioGroupInput,
  RadioGroupInputItem,
  TextInput,
} from "@vivid/builder";
import { MultiStylePropertyPanel } from "../../style-inputs/multi-style-property-panel";
import { ButtonProps, ButtonPropsDefaults } from "./schema";

export const ButtonConfiguration = ({
  data,
  setData,
}: ConfigurationProps<ButtonProps>) => {
  const updateData = (d: unknown) => setData(d as ButtonProps);

  const text = data.props?.text ?? ButtonPropsDefaults.props.text;
  const url = data.props?.url ?? ButtonPropsDefaults.props.url;
  const width = data.props?.width ?? ButtonPropsDefaults.props.width;
  const size = data.props?.size ?? ButtonPropsDefaults.props.size;
  const buttonStyle =
    data.props?.buttonStyle ?? ButtonPropsDefaults.props.buttonStyle;
  const buttonTextColor =
    data.props?.buttonTextColor ?? ButtonPropsDefaults.props.buttonTextColor;
  const buttonBackgroundColor =
    data.props?.buttonBackgroundColor ??
    ButtonPropsDefaults.props.buttonBackgroundColor;

  return (
    <>
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
        defaultValue={width}
        onChange={(width) =>
          updateData({
            ...data,
            props: { ...data.props, width },
          })
        }
      >
        <RadioGroupInputItem value="auto">Auto</RadioGroupInputItem>
        <RadioGroupInputItem value="full">Full</RadioGroupInputItem>
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
    </>
  );
};
