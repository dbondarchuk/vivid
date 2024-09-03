import path from "path";

import { getFrontMatter, MdxContent } from "@/components/web/mdx/mdxContent";
import { existsSync } from "fs";
import { readFile } from "fs/promises";
import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";

type Props = {
  params: { slug: string[] };
};

const getSource = async (slug: string[]) => {
  if (!slug || !slug.length) {
    slug = ["home"];
  }

  const filePath = path.join(process.cwd(), "data", "pages", ...slug) + ".mdx";

  if (!existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    return notFound();
  }

  return await readFile(filePath, "utf-8");
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  const page = await getSource(params.slug);
  const frontmatter = await getFrontMatter(page);

  return {
    title: frontmatter.title as string,
    description: frontmatter.description as string,
    keywords: frontmatter.keywords as string,
  };
}

export default async function Page({ params }: Props) {
  const page = await getSource(params.slug);

  return (
    <div className="container mx-auto flex flex-col gap-20 px-4">
      <MdxContent source={page} />
    </div>
  );
}
