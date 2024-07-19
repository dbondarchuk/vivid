import type { CompileOptions } from "@mdx-js/mdx";
import { compileMDX, MDXRemote } from "next-mdx-remote/rsc";
import type { VFileCompatible } from "vfile";
import { Components } from "../components";
export interface SerializeOptions {
  /**
   * Pass-through variables for use in the MDX content
   */
  scope?: Record<string, unknown>;
  /**
   * These options are passed to the MDX compiler.
   * See [the MDX docs.](https://github.com/mdx-js/mdx/blob/master/packages/mdx/index.js).
   */
  mdxOptions?: Omit<CompileOptions, "outputFormat" | "providerImportSource"> & {
    useDynamicImport?: boolean;
  };
}

export const getFrontMatter = async (
  source: VFileCompatible,
  options?: SerializeOptions
) => {
  const { frontmatter } = await compileMDX({
    source,
    components: Components,
    options: { parseFrontmatter: true, ...options },
  });
  return frontmatter;
};

export const MdxContent: React.FC<{
  source: VFileCompatible;
  options?: SerializeOptions;
}> = ({ source, options }) => {
  return (
    <MDXRemote
      source={source}
      components={Components}
      options={{ parseFrontmatter: true, ...options }}
    />
  );
};
