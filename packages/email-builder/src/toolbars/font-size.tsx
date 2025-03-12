import { ConfigurationProps, NumberInputToolbarMenu } from "@vivid/builder";
import { Leaves } from "@vivid/utils";

const fontSizes = [8, 9, 10, 12, 14, 16, 18, 24, 30, 36, 48];

type PropsType = { style?: { fontSize?: number | null } | null };

export const FontSizeToolbarMenu = <T extends PropsType>({
  defaultValue,
  ...props
}: ConfigurationProps<T> & {
  defaultValue: number;
}) => {
  return (
    <NumberInputToolbarMenu
      defaultValue={defaultValue}
      tooltip="Font size"
      options={fontSizes}
      property={"style.fontSize" as Leaves<T>}
      min={8}
      max={48}
      {...props}
    />
  );
};
