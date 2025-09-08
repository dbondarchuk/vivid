import { ConfigurationProps } from "@vivid/builder";
import { ShortcutsToolbar } from "../../toolbars/shortucts";
import { GridContainerProps } from "./schema";
import { gridContainerShortcuts } from "./shortcuts";

export const GridContainerToolbar = (
  props: ConfigurationProps<GridContainerProps>,
) => (
  <>
    <ShortcutsToolbar
      shortcuts={gridContainerShortcuts}
      data={props.data}
      setData={props.setData}
    />
  </>
);
