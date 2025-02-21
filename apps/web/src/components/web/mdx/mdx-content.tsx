import type { VFileCompatible } from "vfile";

import { evaluate, EvaluateOptions } from "@mdx-js/mdx";
import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import rehypePrettyCode from "rehype-pretty-code";

import { Components } from "../../components";
import { MdxError } from "./mdx-error";

type Runtime = Pick<
  EvaluateOptions,
  "jsx" | "jsxs" | "Fragment" | "rehypePlugins" | "remarkPlugins"
>;

const runtime = {
  jsx,
  jsxs,
  Fragment,
  rehypePlugins: [rehypePrettyCode],
  remarkPlugins: [],
} as Runtime;

export const MdxContent: React.FC<{
  source: VFileCompatible;
  options?: {};
}> = async ({ source, options }) => {
  try {
    const evalResult = await evaluate(source, runtime);
    const MdxContent = evalResult.default;

    return <MdxContent components={Components} />;
  } catch (error) {
    return <MdxError error={error} />;
  }
};
