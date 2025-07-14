import { ConfigurationProps } from "@vivid/builder";
import { ShortcutsToolbar } from "../../toolbars/shortucts";
import { ButtonProps } from "./schema";
import { buttonShortcuts } from "./shortcuts";

export const ButtonToolbar = (props: ConfigurationProps<ButtonProps>) => {
  return (
    <ShortcutsToolbar
      shortcuts={buttonShortcuts}
      data={props.data}
      setData={props.setData}
    />
  );
};
