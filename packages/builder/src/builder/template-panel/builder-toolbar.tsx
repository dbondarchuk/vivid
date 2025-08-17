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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
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
  Laptop,
  Maximize,
  Monitor,
  PanelRight,
  Redo2,
  Smartphone,
  Tablet,
  Trash,
  TriangleAlert,
  Tv,
  Undo2,
  Blocks,
} from "lucide-react";
import React, { Fragment, useCallback, useMemo } from "react";
import {
  canRedoHistory,
  canUndoHistory,
  useBlockDisableOptions,
  useBlocks,
  useDispatchAction,
  useDocument,
  useEditorStateErrors,
  useEditorStateStore,
  useFullScreen,
  useRedoHistory,
  useRootBlock,
  useSelectedBlock,
  useSelectedScreenSize,
  useSetSelectedBlockId,
  useSetSelectedScreenSize,
  useToggleFullScreen,
  useUndoHistory,
  ViewportSize,
} from "../../documents/editor/context";
import { isUndoRedo } from "../../documents/helpers/is-undo-redo";
import { usePortalContext } from "../../documents/blocks/helpers/block-wrappers/portal-context";

type ViewportSizeConfig = {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  className?: string;
};

const VIEWPORT_SIZES: Record<ViewportSize, ViewportSizeConfig> = {
  // original: {
  //   icon: MonitorSmartphone,
  //   label: "baseBuilder.builderToolbar.view.original",
  // },
  desktop: {
    icon: Monitor,
    label: "baseBuilder.builderToolbar.view.desktop",
  },
  largeDesktop: {
    icon: Tv,
    label: "baseBuilder.builderToolbar.view.largeDesktop",
  },
  laptop: {
    icon: Laptop,
    label: "baseBuilder.builderToolbar.view.laptop",
  },
  tablet: {
    icon: Tablet,
    label: "baseBuilder.builderToolbar.view.tablet",
  },
  mobile: {
    icon: Smartphone,
    label: "baseBuilder.builderToolbar.view.mobile",
  },
  mobileLandscape: {
    icon: Smartphone,
    label: "baseBuilder.builderToolbar.view.mobileLandscape",
    className: "rotate-90",
  },
};

export type ViewType = "editor" | "preview";

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
  const document = useDocument();
  const blocks = useBlocks();
  const rootBlock = useRootBlock();
  const { document: portalDocument } = usePortalContext();
  const t = useI18n("builder");
  const tUi = useI18n("ui");

  const history = useEditorStateStore((s) => s.history);
  const selectedScreenSize = useSelectedScreenSize();
  const setSelectedScreenSize = useSetSelectedScreenSize();
  const setSelectedBlockId = useSetSelectedBlockId();
  const fullScreen = useFullScreen();
  const toggleFullScreen = useToggleFullScreen();
  const { resolvedTheme } = useTheme();
  const { toggleSidebar } = useSidebar();
  const selectedBlock = useSelectedBlock();
  const disable = useBlockDisableOptions(selectedBlock?.id);
  const canDoBlockActions = selectedBlock && selectedBlock.id !== document.id;

  const dispatchAction = useDispatchAction();

  const undoHistory = useUndoHistory();
  const redoHistory = useRedoHistory();

  const canUndo = canUndoHistory(history);
  const canRedo = canRedoHistory(history);

  const undoRedo = useCallback(
    (e: KeyboardEvent) => {
      if (isUndoRedo(e) === "undo" && canUndoHistory(history)) {
        undoHistory();
        e.preventDefault();
        e.stopPropagation();
      } else if (isUndoRedo(e) === "redo" && canRedoHistory(history)) {
        redoHistory();
        e.preventDefault();
        e.stopPropagation();
      }
    },
    [canUndo, canRedo, undoHistory, redoHistory, history]
  );

  React.useEffect(() => {
    window.addEventListener("keydown", undoRedo);
    if (portalDocument && portalDocument.defaultView !== window) {
      portalDocument.defaultView?.addEventListener("keydown", undoRedo);
    }
    return () => {
      window.removeEventListener("keydown", undoRedo);
      if (portalDocument && portalDocument.defaultView !== window) {
        portalDocument.defaultView?.removeEventListener("keydown", undoRedo);
      }
    };
  }, [undoRedo, portalDocument]);

  const handleScreenSizeChange = useCallback(
    (value: ViewportSize) => {
      setSelectedScreenSize(value);
    },
    [setSelectedScreenSize]
  );

  const editorErrors = useEditorStateErrors();

  const errors = useMemo(
    () => Object.entries(editorErrors || {}),
    [editorErrors]
  );

  const errorsCount = useMemo(() => errors.length, [errors]);
  const hasErrors = useMemo(() => errorsCount > 0, [errorsCount]);

  const flattendErrors = useMemo(
    () =>
      errors.flatMap(([blockId, { type, error }]) =>
        error.issues.map((issue) => ({
          blockId,
          type,
          displayName: blocks[type].displayName,
          error: issue.message,
          property: issue.path.slice(1).join("."),
        }))
      ),
    [errors, blocks]
  );

  const BlockToolbar = blocks[selectedBlock?.type || rootBlock.type].Toolbar;
  const setBlockData = useCallback(
    (data: any) => {
      dispatchAction({
        type: "set-block-data",
        value: { blockId: selectedBlock?.id || document.id, data },
      });
    },
    [dispatchAction, selectedBlock?.id, document.id]
  );

  const blockData = selectedBlock?.data ?? document.data;

  const ViewportIcon = VIEWPORT_SIZES[selectedScreenSize].icon;

  return (
    <div className="flex flex-col-reverse md:flex-row gap-2 justify-between items-start  w-full border-b border-secondary bg-background sticky top-0 z-[45] p-1">
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
            disabled={!canDoBlockActions || disable?.move}
            onClick={() =>
              dispatchAction({
                type: "move-block-up",
                value: {
                  blockId: selectedBlock!.id,
                },
              })
            }
          >
            <ArrowUp />
          </ToolbarButton>
          <ToolbarButton
            tooltip={t("baseBuilder.builderToolbar.moveDown")}
            disabled={!canDoBlockActions || disable?.move || !selectedBlock}
            onClick={() =>
              dispatchAction({
                type: "move-block-down",
                value: {
                  blockId: selectedBlock!.id,
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
            disabled={!canDoBlockActions || disable?.clone || !selectedBlock}
            onClick={() =>
              dispatchAction({
                type: "clone-block",
                value: {
                  blockId: selectedBlock!.id,
                },
              })
            }
          >
            <Copy />
          </ToolbarButton>
          <ToolbarButton
            tooltip={t("baseBuilder.builderToolbar.delete")}
            disabled={!canDoBlockActions || disable?.delete || !selectedBlock}
            onClick={() => {
              dispatchAction({
                type: "delete-block",
                value: {
                  blockId: selectedBlock!.id,
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
            <BlockToolbar
              data={blockData}
              setData={setBlockData}
              base={selectedBlock?.base}
              onBaseChange={(base) => {
                dispatchAction({
                  type: "set-block-base",
                  value: { blockId: selectedBlock!.id, base },
                });
              }}
            />
          )}
        </ToolbarGroup>
      </Toolbar>
      {/* <div className="grow" /> */}
      <Toolbar className="has-[button]:flex-wrap">
        <ToolbarGroup>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <ToolbarButton
                tooltip={t("baseBuilder.builderToolbar.view.title")}
                isDropdown
                className="text-xs px-2"
              >
                <ViewportIcon
                  className={cn(
                    "size-4",
                    VIEWPORT_SIZES[selectedScreenSize].className
                  )}
                />
              </ToolbarButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="min-w-0">
              <DropdownMenuRadioGroup
                value={selectedScreenSize}
                onValueChange={handleScreenSizeChange as any}
              >
                {Object.entries(VIEWPORT_SIZES).map(([size, config]) => {
                  const Icon = config.icon;
                  return (
                    <DropdownMenuRadioItem
                      key={size}
                      value={size}
                      className="min-w-[220px]"
                    >
                      <Icon className={cn("size-4", config.className)} />
                      {t(config.label as any)}
                    </DropdownMenuRadioItem>
                  );
                })}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
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
                              {t.has(displayName)
                                ? t(displayName)
                                : displayName}
                              .{property}:
                            </em>{" "}
                            {t.has(error as BuilderKeys)
                              ? t(error as BuilderKeys)
                              : error}
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
            <ToolbarButton tooltip={t("baseBuilder.builderToolbar.noErrors")}>
              <Check className="text-green-600" />
            </ToolbarButton>
          )}
        </ToolbarGroup>
        <ToolbarGroup>
          <ToolbarButton
            pressed={selectedView === "preview"}
            tooltip={t("baseBuilder.builderToolbar.preview")}
            onClick={() =>
              setSelectedView((prev) =>
                prev === "editor" ? "preview" : "editor"
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
          {/* <Tooltip>
            <TooltipTrigger asChild>
              <ToolbarButton
                pressed={showBlocksPanel}
                onClick={onToggleBlocksPanel}
              >
                <Blocks />
              </ToolbarButton>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              {t("baseBuilder.builderToolbar.toggleSidebar")}
            </TooltipContent>
          </Tooltip> */}
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
