"use client";

import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { Plate } from "@udecode/plate/react";

import { Editor, EditorContainer } from "../plate-ui/editor";
import { useCreateMarkdownEditor } from "./use-create-markdown-editor";

export type PlateMarkdownEditorProps = {
  onChange?: (value: string) => void;
  value?: string;
  style?: React.CSSProperties;
  className?: string;
  disabled?: boolean;
  placeholder?: string;
};

export const PlateMarkdownEditor: React.FC<PlateMarkdownEditorProps> = ({
  value,
  onChange,
  style,
  className,
  disabled,
  placeholder,
}) => {
  const editor = useCreateMarkdownEditor(value);

  React.useEffect(() => {
    editor.tf.focus({ edge: "endEditor" });
  }, [editor]);

  return (
    <DndProvider backend={HTML5Backend}>
      <Plate
        editor={editor}
        onChange={({}) =>
          onChange?.(editor.api.markdown.serialize().replaceAll("<br>", "\n"))
        }
      >
        <EditorContainer>
          <Editor
            variant="fullWidth"
            className={className}
            style={style}
            disabled={disabled}
            placeholder={placeholder}
          />
        </EditorContainer>

        {/* <SettingsDialog /> */}
      </Plate>
    </DndProvider>
  );
};
