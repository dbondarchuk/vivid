import JsonView from "@uiw/react-json-view";
import { darkTheme } from "@uiw/react-json-view/dark";
import { lightTheme } from "@uiw/react-json-view/light";
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
    <div className="flex flex-row justify-between items-start pb-4 w-full border-b border-secondary bg-background sticky top-0 z-[45] p-1">
      <Toolbar className="w-full flex-wrap">
        <ToolbarGroup>
          <ToolbarButton
            tooltip="Undo (⌘+Z)"
            disabled={!canUndo}
            onClick={() => undoHistory()}
          >
            <Undo2 />
          </ToolbarButton>
          <ToolbarButton
            tooltip="Redo (⌘+⇧+Z)"
            disabled={!canRedo}
            onClick={() => redoHistory()}
          >
            <Redo2 />
          </ToolbarButton>
        </ToolbarGroup>
        <ToolbarGroup>
          <ToolbarButton
            tooltip="Move selected block up"
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
            tooltip="Move selected block down"
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
            tooltip="Clone selected block"
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
            tooltip="Delete selected block"
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
      <div className="grow" />
      <Toolbar>
        <ToolbarGroup>
          <ToolbarButton
            tooltip="Desktop view"
            pressed={selectedScreenSize === "desktop"}
            onClick={() => handleScreenSizeChange("desktop")}
          >
            <Monitor />
          </ToolbarButton>
          <ToolbarButton
            tooltip="Mobile view"
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
                  tooltip={`There are ${errorsCount} issue(s) in the document`}
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
                            {error}
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
            <Eye /> Preview
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
              <TooltipContent side="bottom">View context</TooltipContent>
            </Tooltip>
            <DialogContent className="md:max-w-3/5">
              <DialogTitle>Context values</DialogTitle>
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
                            {copied ? "Copied" : "Copy path"}
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
                    Close
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
            <TooltipContent side="bottom">Toggle sidebar panel</TooltipContent>
          </Tooltip>
        </ToolbarGroup>
      </Toolbar>
    </div>
  );
};
