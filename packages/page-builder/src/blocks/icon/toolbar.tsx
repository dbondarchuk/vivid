import { ConfigurationProps } from "@vivid/builder";
import { ShortcutsToolbar } from "../../toolbars/shortucts";
import { IconProps } from "./schema";
import { iconShortcuts } from "./shortcuts";

export const IconToolbar = (props: ConfigurationProps<IconProps>) => {
  return (
    <ShortcutsToolbar
      shortcuts={iconShortcuts}
      data={props.data}
      setData={props.setData}
    />
  );
};
