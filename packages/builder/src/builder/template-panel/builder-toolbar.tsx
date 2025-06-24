import JsonView from "@uiw/react-json-view";
import { darkTheme } from "@uiw/react-json-view/dark";
import { lightTheme } from "@uiw/react-json-view/light";
import { BuilderKeys, useI18n } from "@vivid/i18n";
import {
  Button,
  cn,
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
  Popover,
  PopoverContent,
  PopoverTrigger,
  ScrollArea,
  Separator,
  Toolbar,
  ToolbarButton,
  ToolbarGroup,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  useSidebar,
  useTheme,
} from "@vivid/ui";
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  Braces,
  Check,
  ClipboardCopy,
  Copy,
  Eye,
  Monitor,
  PanelRight,
  Redo2,
  Smartphone,
  Trash,
  TriangleAlert,
  Undo2,
} from "lucide-react";
import React, { Fragment } from "react";
import {
  canRedoHistory,
  canUndoHistory,
  useBlocks,
  useDispatchAction,
  useDocument,
  useEditorStateErrors,
  useEditorStateStore,
  useRedoHistory,
  useRootBlock,
  useSelectedBlock,
  useSelectedScreenSize,
  useSetSelectedBlockId,
  useSetSelectedScreenSize,
  useUndoHistory,
} from "../../documents/editor/context";
import { isUndoRedo } from "../../documents/helpers/is-undo-redo";

export type ViewType = "editor" | "preview";

type BuilderToolbarProps = {
  selectedView: ViewType;
  setSelectedView: (fn: (prev: ViewType) => ViewType) => void;
  args?: Record<string, any>;
};

export const BuilderToolbar: React.FC<BuilderToolbarProps> = ({
  selectedView,
  setSelectedView,
  args,
}) => {
  const document = useDocument();
  const blocks = useBlocks();
  const rootBlock = useRootBlock();
  const t = useI18n("builder");
  const tUi = useI18n("ui");

  const history = useEditorStateStore((s) => s.history);
  const selectedScreenSize = useSelectedScreenSize();
  const setSelectedScreenSize = useSetSelectedScreenSize();
  const setSelectedBlockId = useSetSelectedBlockId();
  const { resolvedTheme } = useTheme();
  const { toggleSidebar } = useSidebar();
  const selectedBlock = useSelectedBlock();
  const canDoBlockActions = selectedBlock && selectedBlock.id !== document.id;

  const dispatchAction = useDispatchAction();

  const undoHistory = useUndoHistory();
  const redoHistory = useRedoHistory();

  const canUndo = canUndoHistory(history);
  const canRedo = canRedoHistory(history);

  React.useEffect(() => {
    const undoRedo = (e: KeyboardEvent) => {
      if (isUndoRedo(e) === "undo" && canUndoHistory(history)) {
        undoHistory();
        e.preventDefault();
        e.stopPropagation();
      } else if (isUndoRedo(e) === "redo" && canRedoHistory(history)) {
        redoHistory();
        e.preventDefault();
        e.stopPropagation();
      }
    };

    window.addEventListener("keydown", undoRedo);
    return () => {
      window.removeEventListener("keydown", undoRedo);
    };
  });

  const handleScreenSizeChange = (value: string) => {
    switch (value) {
      case "mobile":
      case "desktop":
        setSelectedScreenSize(value);
        return;
      default:
        setSelectedScreenSize("desktop");
    }
  };

  const errors = Object.entries(useEditorStateErrors() || {});
  const errorsCount = errors.length;
  const hasErrors = errorsCount > 0;

  const flattendErrors = errors.flatMap(([blockId, { type, error }]) =>
    error.issues.map((issue) => ({
      blockId,
      type,
      displayName: blocks[type].displayName,
      error: issue.message,
      property: issue.path.slice(1).join("."),
    }))
  );

  const BlockToolbar = blocks[selectedBlock?.type || rootBlock.type].Toolbar;
  const setBlockData = (data: any) => {
    dispatchAction({
      type: "set-block-data",
      value: { blockId: selectedBlock?.id || document.id, data },
    });
  };

  const blockData = selectedBlock?.data ?? document.data;

  return (
    <div className="flex flex-col-reverse md:flex-row gap-2 justify-between items-start pb-4 w-full border-b border-secondary bg-background sticky top-0 z-[45] p-1">
      <Toolbar className="flex-1 has-[button]:flex-wrap">
        <ToolbarGroup>
          <ToolbarButton
            tooltip={t("baseBuilder.builderToolbar.undo")}
            disabled={!canUndo}
            onClick={() => undoHistory()}
          >
            <Undo2 />
          </ToolbarButton>
          <ToolbarButton
            tooltip={t("baseBuilder.builderToolbar.redo")}
            disabled={!canRedo}
            onClick={() => redoHistory()}
          >
            <Redo2 />
          </ToolbarButton>
        </ToolbarGroup>
        <ToolbarGroup>
          <ToolbarButton
            tooltip={t("baseBuilder.builderToolbar.moveUp")}
            disabled={!canDoBlockActions}
            onClick={() =>
              dispatchAction({
                type: "move-block-up",
                value: {
                  blockId: selectedBlock.id,
                },
              })
            }
          >
            <ArrowUp />
          </ToolbarButton>
          <ToolbarButton
            tooltip={t("baseBuilder.builderToolbar.moveDown")}
            disabled={!canDoBlockActions}
            onClick={() =>
              dispatchAction({
                type: "move-block-down",
                value: {
                  blockId: selectedBlock.id,
                },
              })
            }
          >
            <ArrowDown />
          </ToolbarButton>
        </ToolbarGroup>
        <ToolbarGroup>
          <ToolbarButton
            tooltip={t("baseBuilder.builderToolbar.clone")}
            disabled={!canDoBlockActions}
            onClick={() =>
              dispatchAction({
                type: "clone-block",
                value: {
                  blockId: selectedBlock.id,
                },
              })
            }
          >
            <Copy />
          </ToolbarButton>
          <ToolbarButton
            tooltip={t("baseBuilder.builderToolbar.delete")}
            disabled={!canDoBlockActions}
            onClick={() => {
              dispatchAction({
                type: "delete-block",
                value: {
                  blockId: selectedBlock.id,
                },
              });

              setSelectedBlockId(null);
            }}
          >
            <Trash />
          </ToolbarButton>
        </ToolbarGroup>
        <ToolbarGroup>
          {BlockToolbar && (
            <BlockToolbar data={blockData} setData={setBlockData} />
          )}
        </ToolbarGroup>
      </Toolbar>
      {/* <div className="grow" /> */}
      <Toolbar className="has-[button]:flex-wrap">
        <ToolbarGroup>
          <ToolbarButton
            tooltip={t("baseBuilder.builderToolbar.desktopView")}
            pressed={selectedScreenSize === "desktop"}
            onClick={() => handleScreenSizeChange("desktop")}
          >
            <Monitor />
          </ToolbarButton>
          <ToolbarButton
            tooltip={t("baseBuilder.builderToolbar.mobileView")}
            pressed={selectedScreenSize === "mobile"}
            onClick={() => handleScreenSizeChange("mobile")}
          >
            <Smartphone />
          </ToolbarButton>
        </ToolbarGroup>
        <ToolbarGroup>
          {hasErrors ? (
            <Popover>
              <PopoverTrigger asChild>
                <ToolbarButton
                  tooltip={t("baseBuilder.builderToolbar.errors", {
                    count: errorsCount,
                  })}
                >
                  <TriangleAlert className="text-destructive" />
                </ToolbarButton>
              </PopoverTrigger>
              <PopoverContent>
                <ScrollArea className="max-w-80">
                  <div className="w-full flex flex-col gap-2">
                    {flattendErrors.map(
                      ({ blockId, displayName, property, error }, index) => (
                        <Fragment key={blockId}>
                          <div
                            role="button"
                            onClick={() => setSelectedBlockId(blockId)}
                            className="w-full text-destructive cursor-pointer [&>svg]:inline-flex [&>svg]:size-4 text-sm"
                          >
                            <AlertTriangle />{" "}
                            <em>
                              {displayName}.{property}:
                            </em>{" "}
                            {t(error as BuilderKeys)}
                          </div>
                          {index < flattendErrors.length - 1 && <Separator />}
                        </Fragment>
                      )
                    )}
                  </div>
                </ScrollArea>
              </PopoverContent>
            </Popover>
          ) : (
            <ToolbarButton tooltip="Awesome! No issues found!">
              <Check className="text-green-600" />
            </ToolbarButton>
          )}
        </ToolbarGroup>
        <ToolbarGroup>
          <ToolbarButton
            pressed={selectedView === "preview"}
            onClick={() =>
              setSelectedView((prev) =>
                prev === "editor" ? "preview" : "editor"
              )
            }
          >
            <Eye /> {t("baseBuilder.builderToolbar.preview")}
          </ToolbarButton>
        </ToolbarGroup>
        <ToolbarGroup>
          <Dialog>
            <Tooltip>
              <TooltipTrigger asChild>
                <DialogTrigger asChild>
                  <ToolbarButton>
                    <Braces />
                  </ToolbarButton>
                </DialogTrigger>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                {t("baseBuilder.builderToolbar.context")}
              </TooltipContent>
            </Tooltip>
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
              <ToolbarButton onClick={toggleSidebar}>
                <PanelRight />
              </ToolbarButton>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              {t("baseBuilder.builderToolbar.toggleSidebar")}
            </TooltipContent>
          </Tooltip>
        </ToolbarGroup>
      </Toolbar>
    </div>
  );
};
