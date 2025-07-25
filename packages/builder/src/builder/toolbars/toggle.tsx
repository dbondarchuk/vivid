import { Toggle, useOpenState } from "@vivid/ui";
import { destructAndReplace, resolveProperty } from "@vivid/utils";
import { Leaves } from "@vivid/types";
import { ReactNode } from "react";
import { ConfigurationProps } from "../../documents/types";

export type ToolbarToggleProps<T> = ConfigurationProps<T> & {
  property: Leaves<T>;
  tooltip: string;
  icon: ReactNode;
};

export const ToolbarToggle = <T,>({
  data,
  setData,
  property,
  tooltip,
  icon: Icon,
}: ToolbarToggleProps<T>) => {
  const openState = useOpenState();
  const propValue = resolveProperty(data, property);

  return (
    <Toggle
      tooltip={tooltip}
      className="[&>svg]:size-4"
      pressed={!!propValue}
      onPressedChange={(value: boolean) => {
        setData(destructAndReplace(data, property, value) as unknown as any);
      }}
    >
      {Icon}
    </Toggle>
  );
};
