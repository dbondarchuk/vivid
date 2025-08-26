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
  Toolbar,
  ToolbarButton,
  ToolbarGroup,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  useSidebar,
  useTheme,
} from "@vivid/ui";
import { Blocks, Braces, ClipboardCopy, PanelRight } from "lucide-react";
import React from "react";
import { ToolbarBlockGroups } from "./toolbar-block-groups";
import { ToolbarBlockToolbarGroup } from "./toolbar-block-toolbar-group";
import { ToolbarErrorGroup } from "./toolbar-error-group";
import { ToolbarHistoryGroup } from "./toolbar-history-group";
import { ToolbarViewGroup, ViewType } from "./toolbar-view-group";
import { ToolbarViewportGroup } from "./toolbar-viewport-group";

export type { ViewType };

type BuilderToolbarProps = {
  selectedView: ViewType;
  setSelectedView: (fn: (prev: ViewType) => ViewType) => void;
  args?: Record<string, any>;
  showBlocksPanel?: boolean;
  onToggleBlocksPanel?: () => void;
};

export const BuilderToolbar: React.FC<BuilderToolbarProps> = ({
  selectedView,
  setSelectedView,
  args,
  showBlocksPanel,
  onToggleBlocksPanel,
}) => {
  const t = useI18n("builder");
  const tUi = useI18n("ui");

  const { resolvedTheme } = useTheme();
  const { toggleSidebar } = useSidebar();

  return (
    <div className="flex flex-col-reverse md:flex-row gap-2 justify-between items-start  w-full border-b border-secondary bg-background sticky top-0 z-[45] p-1">
      <Toolbar className="flex-1 has-[button]:flex-wrap">
        <ToolbarHistoryGroup />
        <ToolbarBlockGroups />
        <ToolbarBlockToolbarGroup />
      </Toolbar>
      {/* <div className="grow" /> */}
      <Toolbar className="has-[button]:flex-wrap">
        <ToolbarViewportGroup />
        <ToolbarErrorGroup />
        <ToolbarViewGroup
          selectedView={selectedView}
          setSelectedView={setSelectedView}
        />
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
                      { value, keyName, keys, parentValue }
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
                                  copied ? "text-green-600" : ""
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
          <Tooltip>
            <TooltipTrigger asChild>
              <ToolbarButton
                pressed={showBlocksPanel}
                onClick={onToggleBlocksPanel}
              >
                <Blocks />
              </ToolbarButton>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              {t("baseBuilder.builderToolbar.toggleBlocksPanel")}
            </TooltipContent>
          </Tooltip>
          <ToolbarButton
            onClick={toggleSidebar}
            tooltip={t("baseBuilder.builderToolbar.toggleSidebar")}
          >
            <PanelRight />
          </ToolbarButton>
        </ToolbarGroup>
      </Toolbar>
    </div>
  );
};
