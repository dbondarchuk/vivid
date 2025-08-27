"use client";

import JsonView from "@uiw/react-json-view";
import { darkTheme } from "@uiw/react-json-view/dark";
import { lightTheme } from "@uiw/react-json-view/light";
import { useI18n } from "@vivid/i18n";
import {
  Button,
  cn,
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
  ScrollArea,
  ToolbarButton,
  ToolbarGroup,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  useTheme,
} from "@vivid/ui";
import {
  Blocks,
  Braces,
  ClipboardCopy,
  Eye,
  Maximize,
  PanelRight,
  Pause,
} from "lucide-react";
import { memo } from "react";
import {
  useDisableAnimation,
  useFullScreen,
  useSelectedView,
  useSetSelectedView,
  useShowBlocksPanel,
  useToggleDisableAnimation,
  useToggleFullScreen,
  useToggleInspectorDrawer,
  useToggleShowBlocksPanel,
} from "../../../documents/editor/context";

export type ViewType = "editor" | "preview";

export const ToolbarViewGroups = memo(
  ({ args }: { args?: Record<string, any> }) => {
    const t = useI18n("builder");
    const tUi = useI18n("ui");

    const { resolvedTheme } = useTheme();

    const fullScreen = useFullScreen();
    const toggleFullScreen = useToggleFullScreen();
    const disableAnimation = useDisableAnimation();
    const toggleDisableAnimation = useToggleDisableAnimation();

    const selectedView = useSelectedView();
    const setSelectedView = useSetSelectedView();

    const showBlocksPanel = useShowBlocksPanel();
    const onToggleBlocksPanel = useToggleShowBlocksPanel();

    const toggleSidebar = useToggleInspectorDrawer();

    return (
      <>
        <ToolbarGroup>
          <ToolbarButton
            pressed={selectedView === "preview"}
            tooltip={t("baseBuilder.builderToolbar.preview")}
            onClick={() =>
              setSelectedView((prev) =>
                prev === "editor" ? "preview" : "editor",
              )
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
        <ToolbarGroup>
          <Dialog>
            <DialogTrigger asChild>
              <ToolbarButton tooltip={t("baseBuilder.builderToolbar.context")}>
                <Braces />
              </ToolbarButton>
            </DialogTrigger>
            <DialogContent className="md:max-w-3/5">
              <DialogTitle>
                {t("baseBuilder.builderToolbar.contextValues")}
              </DialogTitle>
              <ScrollArea className="max-h-[60vh]">
                <JsonView
                  value={args || {}}
                  style={resolvedTheme === "dark" ? darkTheme : lightTheme}
                >
                  <JsonView.Copied
                    render={(
                      // @ts-expect-error
                      { "data-copied": copied, onClick, ...props },
                      { value, keyName, keys, parentValue },
                    ) => {
                      const click = (event: React.MouseEvent) => {
                        onClick?.(event as any);
                        const text = (keys || []).join(".");
                        navigator.clipboard.writeText(text);
                      };

                      return (
                        <Tooltip>
                          <TooltipTrigger>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="w-4 h-4 p-0 ml-1"
                              onClick={click}
                            >
                              <ClipboardCopy
                                className={cn(
                                  "w-3 h-3",
                                  copied ? "text-green-600" : "",
                                )}
                              />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            {copied
                              ? t("baseBuilder.builderToolbar.copied")
                              : t("baseBuilder.builderToolbar.copyPath")}
                          </TooltipContent>
                        </Tooltip>
                      );
                    }}
                  />
                </JsonView>
              </ScrollArea>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="secondary">
                    {tUi("common.close")}
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <ToolbarButton
            tooltip={t("baseBuilder.builderToolbar.toggleBlocksPanel")}
            pressed={showBlocksPanel}
            onClick={onToggleBlocksPanel}
          >
            <Blocks />
          </ToolbarButton>
          <ToolbarButton
            onClick={toggleSidebar}
            tooltip={t("baseBuilder.builderToolbar.toggleSidebar")}
          >
            <PanelRight />
          </ToolbarButton>
        </ToolbarGroup>
      </>
    );
  },
);
