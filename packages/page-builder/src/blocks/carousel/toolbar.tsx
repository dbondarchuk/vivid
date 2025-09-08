import { ConfigurationProps } from "@vivid/builder";
import { ShortcutsToolbar } from "../../toolbars/shortucts";
import { CarouselProps } from "./schema";
import { carouselShortcuts } from "./shortcuts";

export const CarouselToolbar = (props: ConfigurationProps<CarouselProps>) => (
  <ShortcutsToolbar
    shortcuts={carouselShortcuts}
    data={props.data}
    setData={props.setData}
  />
);
