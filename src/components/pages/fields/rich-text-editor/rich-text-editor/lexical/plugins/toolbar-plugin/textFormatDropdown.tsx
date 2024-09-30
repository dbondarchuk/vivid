import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  $isTextNode,
  FORMAT_TEXT_COMMAND,
  LexicalEditor,
  TextFormatType,
} from "lexical";

import {
  LucideIcon,
  Strikethrough,
  Subscript,
  Superscript,
  ALargeSmall,
  RemoveFormatting,
} from "lucide-react";
import {
  DropdownContent,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "../../ui/dropdownMenu";
import { useCallback } from "react";
import { $getNearestBlockElementAncestorOrThrow } from "@lexical/utils";
import { $isHeadingNode, $isQuoteNode } from "@lexical/rich-text";
import { $isDecoratorBlockNode } from "@lexical/react/LexicalDecoratorBlockNode";

export type TextFormatOptions = "strikethrough" | "subscript" | "superscript";

const TEXT_FORMAT_OPTIONS: Record<
  TextFormatOptions,
  {
    Icon: LucideIcon;
    IconRTL: LucideIcon;
    name: string;
    command: TextFormatType;
  }
> = {
  strikethrough: {
    Icon: Strikethrough,
    IconRTL: Strikethrough,
    name: "Strikethrough",
    command: "strikethrough",
  },
  subscript: {
    Icon: Subscript,
    IconRTL: Subscript,
    name: "Subscript",
    command: "subscript",
  },
  superscript: {
    Icon: Superscript,
    IconRTL: Superscript,
    name: "Superscript",
    command: "superscript",
  },
} as const;

export function TextFormatDropdown({
  editor,
  value,
  isRTL,
}: {
  editor: LexicalEditor;
  value?: Record<TextFormatOptions, boolean>;
  isRTL: boolean;
}) {
  const clearFormatting = useCallback(() => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const anchor = selection.anchor;
        const focus = selection.focus;
        const nodes = selection.getNodes();

        if (anchor.key === focus.key && anchor.offset === focus.offset) {
          return;
        }

        nodes.forEach((node, idx) => {
          // We split the first and last node by the selection
          // So that we don't format unselected text inside those nodes
          if ($isTextNode(node)) {
            // Use a separate variable to ensure TS does not lose the refinement
            let textNode = node;
            if (idx === 0 && anchor.offset !== 0) {
              textNode = textNode.splitText(anchor.offset)[1] || textNode;
            }
            if (idx === nodes.length - 1) {
              textNode = textNode.splitText(focus.offset)[0] || textNode;
            }

            if (textNode.__style !== "") {
              textNode.setStyle("");
            }
            if (textNode.__format !== 0) {
              textNode.setFormat(0);
              $getNearestBlockElementAncestorOrThrow(textNode).setFormat("");
            }
            node = textNode;
          } else if ($isHeadingNode(node) || $isQuoteNode(node)) {
            node.replace($createParagraphNode(), true);
          } else if ($isDecoratorBlockNode(node)) {
            node.setFormat("");
          }
        });
      }
    });
  }, [editor]);

  return (
    <DropdownMenu>
      <DropdownTrigger title="Format options">
        <ALargeSmall size={16} />
      </DropdownTrigger>

      <DropdownContent>
        {Object.keys(TEXT_FORMAT_OPTIONS).map((key) => {
          const { Icon, IconRTL, name, command } =
            TEXT_FORMAT_OPTIONS[key as keyof typeof TEXT_FORMAT_OPTIONS];
          return (
            <DropdownItem
              key={key}
              onClick={() => {
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, command);
              }}
              active={value?.[key as TextFormatOptions]}
            >
              {isRTL ? <IconRTL size={16} /> : <Icon size={16} />}
              <span className="ml-1">{name}</span>
            </DropdownItem>
          );
        })}
        <DropdownItem onClick={clearFormatting}>
          <RemoveFormatting size={16} />
          <span className="ml-1">Clear text formatting</span>
        </DropdownItem>
      </DropdownContent>
    </DropdownMenu>
  );
}
