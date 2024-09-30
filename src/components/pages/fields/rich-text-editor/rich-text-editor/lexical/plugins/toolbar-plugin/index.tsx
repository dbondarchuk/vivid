import { $isLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import { $isListNode, ListNode } from "@lexical/list";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $isHeadingNode } from "@lexical/rich-text";
import {
  $getSelectionStyleValueForProperty,
  $isParentElementRTL,
  $patchStyleText,
} from "@lexical/selection";
import {
  $findMatchingParent,
  $getNearestNodeOfType,
  mergeRegister,
} from "@lexical/utils";
import {
  $getSelection,
  $isElementNode,
  $isRangeSelection,
  $isRootOrShadowRoot,
  COMMAND_PRIORITY_CRITICAL,
  COMMAND_PRIORITY_NORMAL,
  ElementFormatType,
  FORMAT_TEXT_COMMAND,
  KEY_MODIFIER_COMMAND,
  SELECTION_CHANGE_COMMAND,
} from "lexical";
import { $isTableSelection } from "@lexical/table";
import { Dispatch, useCallback, useEffect, useState } from "react";

import {
  Baseline,
  Bold,
  Italic,
  Link,
  PaintBucket,
  Underline,
} from "lucide-react";
import { getSelectedNode } from "../../utils/get-selected-node";
import { sanitizeUrl } from "../../utils/url";
import { Button } from "../../ui/button";
import { getToolbarPortal } from "../../utils/get-toolbar-portal";

import { isApple } from "../../utils/is-apple";
import { BlockFormatDropDown, blockFormats } from "./blockFormatDropdown";
import { ElementFormatDropdown } from "./elementFormatDropdown";
import DropdownColorPicker from "./dropdownColorPicker";
import { TextFormatDropdown, TextFormatOptions } from "./textFormatDropdown";
import FontSize from "./fontSize";
import { InsertDropdown } from "./insertDropdown";
import useModal from "../../editor/hooks/useModal";

const IS_APPLE = isApple();

export function ToolbarPlugin({
  id,
  showToolbar,
  setIsLinkEditMode,
}: {
  id: string;
  showToolbar: boolean;
  setIsLinkEditMode: Dispatch<boolean>;
}) {
  const [editor] = useLexicalComposerContext();
  const [activeEditor, setActiveEditor] = useState(editor);
  const [blockType, setBlockType] =
    useState<keyof typeof blockFormats>("paragraph");

  const [elementFormat, setElementFormat] = useState<ElementFormatType>("left");
  const [isLink, setIsLink] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [textFormat, setTextFormat] = useState<
    Record<TextFormatOptions, boolean> | undefined
  >(undefined);

  const [fontSize, setFontSize] = useState<string>("15px");
  const [fontColor, setFontColor] = useState<string>("#000");
  const [bgColor, setBgColor] = useState<string>("#fff");

  const [isRTL, setIsRTL] = useState(false);

  const [modal, showModal] = useModal();

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode();
      let element =
        anchorNode.getKey() === "root"
          ? anchorNode
          : $findMatchingParent(anchorNode, (e) => {
              const parent = e.getParent();
              return parent !== null && $isRootOrShadowRoot(parent);
            });

      if (element === null) {
        element = anchorNode.getTopLevelElementOrThrow();
      }

      const elementKey = element.getKey();
      const elementDOM = activeEditor.getElementByKey(elementKey);

      // Update text format
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));

      setTextFormat({
        strikethrough: selection.hasFormat("strikethrough"),
        subscript: selection.hasFormat("subscript"),
        superscript: selection.hasFormat("superscript"),
      });

      setIsRTL($isParentElementRTL(selection));

      // Update links
      const node = getSelectedNode(selection);
      const parent = node.getParent();
      if ($isLinkNode(parent) || $isLinkNode(node)) {
        setIsLink(true);
      } else {
        setIsLink(false);
      }

      if (elementDOM !== null) {
        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType<ListNode>(
            anchorNode,
            ListNode
          );
          const type = parentList
            ? parentList.getListType()
            : element.getListType();
          if (type in blockFormats) {
            setBlockType(type as keyof typeof blockFormats);
          }
        } else {
          const type = $isHeadingNode(element)
            ? element.getTag()
            : element.getType();
          if (type in blockFormats) {
            setBlockType(type as keyof typeof blockFormats);
          }
        }
      }

      // Handle buttons
      setFontColor(
        $getSelectionStyleValueForProperty(selection, "color", "#000")
      );
      setBgColor(
        $getSelectionStyleValueForProperty(
          selection,
          "background-color",
          "#fff"
        )
      );

      let matchingParent;
      if ($isLinkNode(parent)) {
        // If node is a link, we need to fetch the parent paragraph node to set format
        matchingParent = $findMatchingParent(
          node,
          (parentNode) => $isElementNode(parentNode) && !parentNode.isInline()
        );
      }

      // If matchingParent is a valid node, pass it's format type
      setElementFormat(
        $isElementNode(matchingParent)
          ? matchingParent.getFormatType()
          : $isElementNode(node)
          ? node.getFormatType()
          : parent?.getFormatType() || "left"
      );
    }
    if ($isRangeSelection(selection) || $isTableSelection(selection)) {
      setFontSize(
        $getSelectionStyleValueForProperty(selection, "font-size", "15px")
      );
    }
  }, [activeEditor]);

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      (_payload, newEditor) => {
        $updateToolbar();
        setActiveEditor(newEditor);
        return false;
      },
      COMMAND_PRIORITY_CRITICAL
    );
  }, [editor, $updateToolbar]);

  useEffect(() => {
    return mergeRegister(
      activeEditor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          $updateToolbar();
        });
      })
    );
  }, [$updateToolbar, editor, activeEditor]);

  useEffect(() => {
    return activeEditor.registerCommand(
      KEY_MODIFIER_COMMAND,
      (payload) => {
        const event: KeyboardEvent = payload;
        const { code, ctrlKey, metaKey } = event;

        if (code === "KeyK" && (ctrlKey || metaKey)) {
          event.preventDefault();
          let url: string | null;
          if (!isLink) {
            setIsLinkEditMode(true);
            url = sanitizeUrl("https://");
          } else {
            setIsLinkEditMode(false);
            url = null;
          }
          return activeEditor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
        }
        return false;
      },
      COMMAND_PRIORITY_NORMAL
    );
  }, [activeEditor, isLink, setIsLinkEditMode]);

  const applyStyleText = useCallback(
    (styles: Record<string, string>, skipHistoryStack?: boolean) => {
      activeEditor.update(
        () => {
          const selection = $getSelection();
          if (selection !== null) {
            $patchStyleText(selection, styles);
          }
        },
        skipHistoryStack ? { tag: "historic" } : {}
      );
    },
    [activeEditor]
  );

  const onFontColorSelect = useCallback(
    (value: string, skipHistoryStack: boolean) => {
      applyStyleText({ color: value }, skipHistoryStack);
    },
    [applyStyleText]
  );

  const onBgColorSelect = useCallback(
    (value: string, skipHistoryStack: boolean) => {
      applyStyleText({ "background-color": value }, skipHistoryStack);
    },
    [applyStyleText]
  );

  const insertLink = useCallback(() => {
    if (!isLink) {
      setIsLinkEditMode(true);
      activeEditor.dispatchCommand(
        TOGGLE_LINK_COMMAND,
        sanitizeUrl("https://")
      );
    } else {
      setIsLinkEditMode(false);
      activeEditor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }
  }, [activeEditor, isLink, setIsLinkEditMode]);

  useEffect(() => {
    return activeEditor.registerCommand(
      KEY_MODIFIER_COMMAND,
      (payload) => {
        const event: KeyboardEvent = payload;
        const { code, ctrlKey, metaKey } = event;

        if (code === "KeyK" && (ctrlKey || metaKey)) {
          event.preventDefault();
          let url: string | null;
          if (!isLink) {
            setIsLinkEditMode(true);
            url = sanitizeUrl("https://");
          } else {
            setIsLinkEditMode(false);
            url = null;
          }
          return activeEditor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
        }
        return false;
      },
      COMMAND_PRIORITY_NORMAL
    );
  }, [activeEditor, isLink, setIsLinkEditMode]);

  const portalTarget = getToolbarPortal(id);

  if (!showToolbar) {
    return null;
  }

  if (!portalTarget) {
    return null;
  }

  const parent = portalTarget.parentElement;
  if (parent) portalTarget.parentElement.style.zIndex = "10";

  // return createPortal(
  return (
    <div className="flex gap-4 bottom-0 bg-background sticky">
      <BlockFormatDropDown blockType={blockType} editor={editor} />

      <ElementFormatDropdown
        value={elementFormat}
        editor={editor}
        isRTL={isRTL}
      />
      <FontSize
        selectionFontSize={fontSize.slice(0, -2)}
        editor={activeEditor}
        disabled={false}
      />
      <Button
        onClick={() => {
          activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
        }}
        active={isBold}
        title={IS_APPLE ? "Bold (⌘B)" : "Bold (Ctrl+B)"}
        aria-label={`Format text as bold. Shortcut: ${
          IS_APPLE ? "⌘B" : "Ctrl+B"
        }`}
      >
        <Bold size={16} />
      </Button>
      <Button
        onClick={() => {
          activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
        }}
        active={isItalic}
        title={IS_APPLE ? "Italic (⌘I)" : "Italic (Ctrl+I)"}
        aria-label={`Format text as italics. Shortcut: ${
          IS_APPLE ? "⌘I" : "Ctrl+I"
        }`}
      >
        <Italic size={16} />
      </Button>
      <Button
        onClick={() => {
          activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
        }}
        active={isUnderline}
        title={IS_APPLE ? "Underline (⌘U)" : "Underline (Ctrl+U)"}
        aria-label={`Format text to underlined. Shortcut: ${
          IS_APPLE ? "⌘U" : "Ctrl+U"
        }`}
      >
        <Underline size={16} />
      </Button>
      <Button
        onClick={insertLink}
        active={isLink}
        title="Insert link"
        aria-label="Insert link"
        type="button"
      >
        <Link size={16} />
      </Button>
      <DropdownColorPicker
        buttonAriaLabel="Formatting text color"
        buttonIcon={<Baseline size={16} />}
        color={fontColor}
        onChange={onFontColorSelect}
        title="Text color"
      />
      <DropdownColorPicker
        buttonAriaLabel="Formatting background color"
        buttonIcon={<PaintBucket size={16} />}
        color={bgColor}
        onChange={onBgColorSelect}
        title="Background color"
      />
      <TextFormatDropdown
        editor={activeEditor}
        isRTL={isRTL}
        value={textFormat}
      />
      <InsertDropdown
        editor={activeEditor}
        isRTL={isRTL}
        showModal={showModal}
      />
      {modal}
    </div>
  );
  //   portalTarget
  // );
}
