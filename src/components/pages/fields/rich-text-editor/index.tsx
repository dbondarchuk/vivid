import type { CustomField, Field } from "@measured/puck";
import type { SerializedEditorState } from "lexical";

import { Editor } from "./rich-text-editor/editor-client";
import { Render } from "./rich-text-editor/render-client";
import React from "react";

export type RichTextFieldType = SerializedEditorState;

export type RichTextProps = {
  state: SerializedEditorState;
  isEditing?: boolean;
  id: string;
};

export const RichTextField: CustomField<RichTextFieldType> = {
  type: "custom",
  render: () => <></>,
};

export const RichTextFieldRender: React.FC<RichTextProps> = ({
  isEditing,
  ...rest
}) => <>{isEditing ? <Editor {...rest} /> : <Render {...rest} />}</>;
