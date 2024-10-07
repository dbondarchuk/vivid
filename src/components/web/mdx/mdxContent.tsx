import type { VFileCompatible } from "vfile";

import { evaluate, EvaluateOptions } from "@mdx-js/mdx";
import { jsx, jsxs, Fragment } from "react/jsx-runtime";

import { Components } from "../../components";
import { MdxError } from "./mdxError";

type Runtime = Pick<EvaluateOptions, "jsx" | "jsxs" | "Fragment">;

const runtime = { jsx, jsxs, Fragment } as Runtime;
export const MdxContent: React.FC<{
  source: VFileCompatible;
  options?: any;
}> = async ({ source, options }) => {
  try {
    const evalResult = await evaluate(source, runtime);
    const MdxContent = evalResult.default;

    return <MdxContent components={Components} />;
  } catch (error) {
    return <MdxError error={error} />;
  }
};
