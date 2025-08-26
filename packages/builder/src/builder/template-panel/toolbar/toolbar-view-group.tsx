"use client";

import { ToolbarGroup, ToolbarButton } from "@vivid/ui";
import { Eye, Maximize, Pause } from "lucide-react";
import { useI18n } from "@vivid/i18n";
import {
  useFullScreen,
  useDisableAnimation,
  useToggleDisableAnimation,
  useToggleFullScreen,
} from "../../../documents/editor/context";

export type ViewType = "editor" | "preview";

export const ToolbarViewGroup = ({
  selectedView,
  setSelectedView,
}: {
  selectedView: ViewType;
  setSelectedView: (fn: (prev: ViewType) => ViewType) => void;
}) => {
  const t = useI18n("builder");
  const fullScreen = useFullScreen();
  const toggleFullScreen = useToggleFullScreen();
  const disableAnimation = useDisableAnimation();
  const toggleDisableAnimation = useToggleDisableAnimation();

  return (
    <ToolbarGroup>
      <ToolbarButton
        pressed={selectedView === "preview"}
        tooltip={t("baseBuilder.builderToolbar.preview")}
        onClick={() =>
          setSelectedView((prev) => (prev === "editor" ? "preview" : "editor"))
        }
      >
        <Eye />
      </ToolbarButton>
      <ToolbarButton
        pressed={fullScreen}
        onClick={toggleFullScreen}
        tooltip={t("baseBuilder.builderToolbar.fullScreen")}
      >
        <Maximize />
      </ToolbarButton>
      <ToolbarButton
        pressed={disableAnimation}
        onClick={toggleDisableAnimation}
        tooltip={
          disableAnimation
            ? t("baseBuilder.builderToolbar.enableAnimation")
            : t("baseBuilder.builderToolbar.disableAnimation")
        }
      >
        <Pause />
      </ToolbarButton>
    </ToolbarGroup>
  );
};
