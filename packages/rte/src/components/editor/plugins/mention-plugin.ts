"use client";

import { ArgsPlugin } from "./args-plugin";

export const mentionPlugin = ArgsPlugin.configure({
  options: { triggerPreviousCharPattern: /^$|^[\s"']$/ },
});
