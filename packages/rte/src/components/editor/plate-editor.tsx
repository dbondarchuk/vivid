"use client";

import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { Plate } from "@udecode/plate/react";

import { useCreateEditor } from "./use-create-editor";
import { Editor, EditorContainer } from "../plate-ui/editor";
import { Value } from "@udecode/plate";

export type PlateEditorProps = {
  onChange?: (value: Value) => void;
  value?: Value;
  style?: React.CSSProperties;
  className?: string;
};

export const PlateEditor: React.FC<PlateEditorProps> = ({
  value,
  onChange,
  style,
  className,
}) => {
  const editor = useCreateEditor(value);

  React.useEffect(() => {
    editor.tf.focus({ edge: "endEditor" });
  }, [editor]);

  return (
    <DndProvider backend={HTML5Backend}>
      <Plate editor={editor} onChange={({ value }) => onChange?.(value)}>
        <EditorContainer>
          <Editor variant="fullWidth" className={className} style={style} />
        </EditorContainer>

        {/* <SettingsDialog /> */}
      </Plate>
    </DndProvider>
  );
};
