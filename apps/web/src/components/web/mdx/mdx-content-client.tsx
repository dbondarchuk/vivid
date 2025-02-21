"use client";

import React from "react";

import { evaluate } from "@mdx-js/mdx";
import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import type { EvaluateOptions } from "@mdx-js/mdx";
import type { MDXProps } from "mdx/types";
import rehypePrettyCode from "rehype-pretty-code";

import { ClientComponents } from "../../client-components";
import { MdxError } from "./mdx-error";

type ReactMDXContent = (props: MDXProps) => React.ReactNode;
type Runtime = Pick<EvaluateOptions, "jsx" | "jsxs" | "Fragment">;

const runtime = {
  jsx,
  jsxs,
  Fragment,
  rehypePlugins: [rehypePrettyCode],
} as Runtime;

export const MdxContent: React.FC<{
  source: string;
}> = ({ source }) => {
  const [MdxContent, setMdxContent] = React.useState<ReactMDXContent>(
    () => () => null
  );

  const [error, setError] = React.useState<any>();

  React.useEffect(() => {
    setError(undefined);
    evaluate(source, runtime)
      .then((r) => setMdxContent(() => r.default))
      .catch((err) => setError(() => err));
  }, [source]);

  if (error) {
    return <MdxError error={error} />;
  }

  return <MdxContent components={ClientComponents} />;
};
