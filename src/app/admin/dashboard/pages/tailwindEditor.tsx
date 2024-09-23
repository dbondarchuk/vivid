// "use client";

// import React from "react";
// import { EditorContent, EditorRoot, JSONContent } from "novel";
// import GlobalDragHandle from "tiptap-extension-global-drag-handle";
// import AutoJoiner from "tiptap-extension-auto-joiner"; // optional

// export const defaultExtensions = [
//   GlobalDragHandle,
//   AutoJoiner, // optional
//   // other extensions
// ];

// export const TailwindEditor = () => {
//   const [content, setContent] = React.useState<JSONContent | undefined>(
//     undefined
//   );
//   return (
//     <EditorRoot>
//       <EditorContent
//         extensions={defaultExtensions}
//         initialContent={content}
//         onUpdate={({ editor }) => {
//           const json = editor.getJSON();
//           setContent(json);
//         }}
//       />
//     </EditorRoot>
//   );
// };
