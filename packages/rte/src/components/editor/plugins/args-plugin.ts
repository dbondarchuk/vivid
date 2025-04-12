import { createSlatePlugin, createTSlatePlugin } from "@udecode/plate";
import { withTriggerCombobox } from "@udecode/plate-combobox";
import { toPlatePlugin } from "@udecode/plate/react";

const argsInputPlugin = createSlatePlugin({
  key: "mention_input",
  node: { isElement: true, isInline: true, isVoid: true },
});

const argsPlugin = createTSlatePlugin({
  key: "mention",
  node: { isElement: true, isInline: true, isMarkableVoid: true, isVoid: true },
  options: {
    trigger: "{{",
    triggerPreviousCharPattern: /^\s?$/,
    createComboboxInput: (trigger: any) => ({
      children: [{ text: "" }],
      trigger,
      type: argsInputPlugin.key,
    }),
  },
  plugins: [argsInputPlugin],
})
  .extendEditorTransforms(({ editor, type }) => ({
    insert: {
      mention: ({ key, value }: { key: string; value: any }) => {
        editor.tf.insertNodes({
          key,
          children: [{ text: "" }],
          type,
          value,
        });
      },
    },
  }))
  // @ts-ignore
  .overrideEditor(withTriggerCombobox);

export const ArgsPlugin = toPlatePlugin(argsPlugin);
export const ArgsInputPlugin = toPlatePlugin(argsInputPlugin);
