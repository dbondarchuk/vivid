import { Value } from "@udecode/plate";
import { MarkdownPlugin } from "@udecode/plate-markdown";
import { createPlateStaticEditor } from "./plate-static-editor";

export const deserializeMarkdown = (value: string): Value => {
  const editor = createPlateStaticEditor(undefined, { includeMarkdown: true });
  const api = editor.getApi(MarkdownPlugin);

  return api.markdown.deserialize(value);
};
