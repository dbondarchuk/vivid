import { MdxContent } from "@/components/web/mdx/mdxContent";
import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { Services } from "@/lib/services";
import { cache } from "react";

type Props = {
  params: { slug: string[] };
};

export const dynamicParams = true;
export const revalidate = 60;

const getSource = cache(async (slug: string[]) => {
  if (!slug || !slug.length) {
    slug = ["home"];
  }

  const pageSlug = slug.join("/");
  const page = await Services.PagesService().getPageBySlug(pageSlug);

  if (!page) {
    console.error(`Page not found: ${pageSlug}`);
    return notFound();
  }

  return page;
});

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  const settings = await Services.ConfigurationService().getConfiguration(
    "general"
  );
  const page = await getSource(params.slug);

  return {
    title: page.doNotCombine?.title
      ? page.title
      : [settings.title, page.title].filter((x) => !!x).join(" - "),
    description: page.doNotCombine?.description
      ? page.description
      : [settings.description, page.description].filter((x) => !!x).join("\n"),
    keywords: page.doNotCombine?.keywords
      ? page.keywords
      : [settings.keywords, page.keywords].filter((x) => !!x).join(", "),
  };
}

export default async function Page({ params }: Props) {
  const page = await getSource(params.slug);

  return (
    <div className="container mx-auto flex flex-col gap-5 px-4">
      <MdxContent source={page.content} />
    </div>
  );
}
