import { ConfigurationProps } from "@vivid/builder";
import { ShortcutsToolbar } from "../../toolbars/shortucts";
import { ContainerProps } from "./schema";
import { containerShortcuts } from "./shortcuts";

export const ContainerToolbar = (props: ConfigurationProps<ContainerProps>) => (
  <ShortcutsToolbar
    shortcuts={containerShortcuts}
    data={props.data}
    setData={props.setData}
  />
);
