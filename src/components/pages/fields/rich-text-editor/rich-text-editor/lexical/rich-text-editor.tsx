import { SerializedEditorState } from "lexical";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from "@lexical/list";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { useEffect, useState } from "react";
import { FocusPlugin } from "./plugins/focus-plugin";
import { ToolbarPlugin } from "./plugins/toolbar-plugin";
import DragDropPaste from "./editor/plugins/DragDropPastePlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { ClearEditorPlugin } from "@lexical/react/LexicalClearEditorPlugin";
import ComponentPickerPlugin from "./editor/plugins/ComponentPickerPlugin";
import EmojiPickerPlugin from "./editor/plugins/EmojiPickerPlugin";
import AutoEmbedPlugin from "./editor/plugins/AutoEmbedPlugin";
import EmojisPlugin from "./editor/plugins/EmojisPlugin";
import { HashtagPlugin } from "@lexical/react/LexicalHashtagPlugin";
import KeywordsPlugin from "./editor/plugins/KeywordsPlugin";
import AutoLinkPlugin from "./editor/plugins/AutoLinkPlugin";
import CodeHighlightPlugin from "./editor/plugins/CodeHighlightPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin";
import ListMaxIndentLevelPlugin from "./editor/plugins/ListMaxIndentLevelPlugin";
import { TablePlugin } from "@lexical/react/LexicalTablePlugin";
import TableCellResizer from "./editor/plugins/TableCellResizer";
import TableHoverActionsPlugin from "./editor/plugins/TableHoverActionsPlugin";
import ImagesPlugin from "./editor/plugins/ImagesPlugin";
import InlineImagePlugin from "./editor/plugins/InlineImagePlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import TwitterPlugin from "./editor/plugins/TwitterPlugin";
import YouTubePlugin from "./editor/plugins/YouTubePlugin";
import { ClickableLinkPlugin } from "@lexical/react/LexicalClickableLinkPlugin";
import { HorizontalRulePlugin } from "@lexical/react/LexicalHorizontalRulePlugin";
import EquationsPlugin from "./editor/plugins/EquationsPlugin";
import ExcalidrawPlugin from "./editor/plugins/ExcalidrawPlugin";
import TabFocusPlugin from "./editor/plugins/TabFocusPlugin";
import { TabIndentationPlugin } from "@lexical/react/LexicalTabIndentationPlugin";
import PageBreakPlugin from "./editor/plugins/PageBreakPlugin";
import { LayoutPlugin } from "./editor/plugins/LayoutPlugin/LayoutPlugin";
import { CAN_USE_DOM } from "@lexical/utils";
import PlaygroundNodes from "./editor/nodes/PlaygroundNodes";
import DraggableBlockPlugin from "./editor/plugins/DraggableBlockPlugin";
import CodeActionMenuPlugin from "./editor/plugins/CodeActionMenuPlugin";
import FloatingLinkEditorPlugin from "./plugins/floatingLinkEditor";
import FloatingTextFormatToolbarPlugin from "./plugins/floatingToolbar";
import TableCellActionMenuPlugin from "./editor/plugins/TableActionMenuPlugin";
import { editorTheme } from "./theme";
import { cn } from "@/lib/utils";

export const InlineRichTextEditor = ({
  id,
  state,
  enabled,
  onChange = () => {},
}: {
  id: string;
  state: SerializedEditorState;
  enabled: boolean;
  onChange?: (props: { state: SerializedEditorState }) => void;
}) => {
  const [_isLinkEditMode, setIsLinkEditMode] = useState(false);

  const [floatingAnchorElem, setFloatingAnchorElem] =
    useState<HTMLDivElement | null>(null);
  const [isSmallWidthViewport, setIsSmallWidthViewport] =
    useState<boolean>(false);

  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem);
    }
  };

  useEffect(() => {
    const updateViewPortWidth = () => {
      const isNextSmallWidthViewport =
        CAN_USE_DOM && window.matchMedia("(max-width: 1025px)").matches;

      if (isNextSmallWidthViewport !== isSmallWidthViewport) {
        setIsSmallWidthViewport(isNextSmallWidthViewport);
      }
    };
    updateViewPortWidth();
    window.addEventListener("resize", updateViewPortWidth);

    return () => {
      window.removeEventListener("resize", updateViewPortWidth);
    };
  }, [isSmallWidthViewport]);

  return (
    <div style={{ position: "relative" }}>
      <LexicalComposer
        initialConfig={{
          namespace: id,
          editable: false,
          theme: editorTheme,
          editorState: JSON.stringify(state),
          nodes: PlaygroundNodes,
          onError(error: unknown) {
            throw error;
          },
        }}
      >
        <DragDropPaste />
        <ComponentPickerPlugin />
        <EmojiPickerPlugin />
        <AutoEmbedPlugin />

        <EmojisPlugin />
        <HashtagPlugin />
        <KeywordsPlugin />
        <AutoLinkPlugin />

        <RichTextPlugin
          contentEditable={
            <div
              className={cn(
                "min-h-[150px] border-none flex relative outline-0 z-0 overflow-auto resize-y group",
                enabled ? "edit-mode" : ""
              )}
            >
              <div className="flex-auto relative resize-y z-[-1]" ref={onRef}>
                <ContentEditable
                  style={{ outline: "none" }}
                  aria-placeholder="Text"
                  placeholder={
                    <div className="text-muted-foreground">Text</div>
                  }
                />
              </div>
            </div>
          }
          placeholder={null}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <OnChangePlugin
          ignoreSelectionChange
          onChange={(state) => onChange({ state: state.toJSON() })}
        />
        <FocusPlugin enabled={enabled} />
        <HistoryPlugin />

        <CodeHighlightPlugin />
        <ListPlugin />
        <CheckListPlugin />
        <ListMaxIndentLevelPlugin maxDepth={7} />
        <TablePlugin hasCellMerge={true} hasCellBackgroundColor={true} />
        <TableCellResizer />
        <TableHoverActionsPlugin />
        <ImagesPlugin />
        <InlineImagePlugin />
        <LinkPlugin />
        <TwitterPlugin />
        <YouTubePlugin />
        <ClickableLinkPlugin disabled={!enabled} />
        <HorizontalRulePlugin />
        <EquationsPlugin />
        <ExcalidrawPlugin />
        <TabFocusPlugin />
        <TabIndentationPlugin />
        <PageBreakPlugin />
        <LayoutPlugin />

        <ToolbarPlugin
          id={id}
          showToolbar={enabled}
          setIsLinkEditMode={setIsLinkEditMode}
        />

        {floatingAnchorElem && !isSmallWidthViewport && (
          <>
            <DraggableBlockPlugin anchorElem={floatingAnchorElem} />
            <CodeActionMenuPlugin anchorElem={floatingAnchorElem} />
            <FloatingLinkEditorPlugin
              anchorElem={floatingAnchorElem}
              isLinkEditMode={_isLinkEditMode}
              setIsLinkEditMode={setIsLinkEditMode}
            />
            <TableCellActionMenuPlugin
              anchorElem={floatingAnchorElem}
              cellMerge={true}
            />
            <FloatingTextFormatToolbarPlugin
              anchorElem={floatingAnchorElem}
              setIsLinkEditMode={setIsLinkEditMode}
            />
          </>
        )}
      </LexicalComposer>
    </div>
  );
};
