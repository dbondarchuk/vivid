import { LexicalEditor } from "lexical";

import {
  Columns,
  Image,
  Minus,
  Plus,
  Sigma,
  SquareSplitVertical,
  Table,
} from "lucide-react";
import {
  DropdownContent,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "../../ui/dropdownMenu";
import { INSERT_HORIZONTAL_RULE_COMMAND } from "@lexical/react/LexicalHorizontalRuleNode";
import { INSERT_PAGE_BREAK } from "../../editor/plugins/PageBreakPlugin";
import { InsertImageDialog } from "../../editor/plugins/ImagesPlugin";
import { InsertTableDialog } from "../../editor/plugins/TablePlugin";
import InsertLayoutDialog from "../../editor/plugins/LayoutPlugin/InsertLayoutDialog";
import { InsertEquationDialog } from "../../editor/plugins/EquationsPlugin";
import { EmbedConfigs } from "../../editor/plugins/AutoEmbedPlugin";
import { INSERT_EMBED_COMMAND } from "@lexical/react/LexicalAutoEmbedPlugin";

export function InsertDropdown({
  editor,
  showModal,
  value,
  isRTL,
}: {
  editor: LexicalEditor;
  showModal: (
    title: string,
    showModal: (onClose: () => void) => React.ReactElement
  ) => void;
  value?: Record<string, boolean>;
  isRTL: boolean;
}) {
  return (
    <DropdownMenu>
      <DropdownTrigger title="Format options">
        <Plus size={16} /> Insert
      </DropdownTrigger>

      <DropdownContent>
        <DropdownItem
          onClick={() => {
            editor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined);
          }}
        >
          <Minus size={16} className="mr-1" />
          Horizontal Rule
        </DropdownItem>
        <DropdownItem
          onClick={() => {
            editor.dispatchCommand(INSERT_PAGE_BREAK, undefined);
          }}
        >
          <SquareSplitVertical size={16} className="mr-1" />
          Page Break
        </DropdownItem>
        <DropdownItem
          onClick={() => {
            showModal("Insert Image", (onClose) => (
              <InsertImageDialog activeEditor={editor} onClose={onClose} />
            ));
          }}
        >
          <Image size={16} className="mr-1" />
          Image
        </DropdownItem>
        <DropdownItem
          onClick={() => {
            showModal("Insert Table", (onClose) => (
              <InsertTableDialog activeEditor={editor} onClose={onClose} />
            ));
          }}
        >
          <Table size={16} className="mr-1" />
          Table
        </DropdownItem>
        <DropdownItem
          onClick={() => {
            showModal("Insert Columns Layout", (onClose) => (
              <InsertLayoutDialog activeEditor={editor} onClose={onClose} />
            ));
          }}
        >
          <Columns size={16} className="mr-1" />
          Columns Layout
        </DropdownItem>
        <DropdownItem
          onClick={() => {
            showModal("Insert Equation", (onClose) => (
              <InsertEquationDialog activeEditor={editor} onClose={onClose} />
            ));
          }}
        >
          <Sigma size={16} className="mr-1" />
          Equation
        </DropdownItem>
        {EmbedConfigs.map((embedConfig) => (
          <DropdownItem
            key={embedConfig.type}
            onClick={() => {
              editor.dispatchCommand(INSERT_EMBED_COMMAND, embedConfig.type);
            }}
          >
            {embedConfig.icon}
            <span className="mr-1">{embedConfig.contentName}</span>
          </DropdownItem>
        ))}
      </DropdownContent>
    </DropdownMenu>
  );
}
