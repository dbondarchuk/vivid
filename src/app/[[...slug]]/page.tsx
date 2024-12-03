import { MdxContent } from "@/components/web/mdx/mdxContent";
import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { Services } from "@/lib/services";
import { cache } from "react";
import { setPageData } from "@/lib/pageDataCache";
import { cn } from "@/lib/utils";

type Props = {
  params: { slug: string[] };
  searchParams?: {
    preview?: boolean;
  };
};

export const dynamicParams = true;
export const revalidate = 60;

const getSource = cache(async (slug: string[], preview = false) => {
  if (!slug || !slug.length) {
    slug = ["home"];
  }

  const pageSlug = slug.join("/");
  const page = await Services.PagesService().getPageBySlug(pageSlug);

  if (
    !page ||
    (!preview && (!page.published || page.publishDate > new Date()))
  ) {
    console.error(`Page not found: ${pageSlug}`);
    return notFound();
  }

  return page;
});

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  const settings = await Services.ConfigurationService().getConfiguration(
    "general"
  );

  const page = await getSource(params.slug, searchParams?.preview);

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

export default async function Page({ params, searchParams }: Props) {
  const page = await getSource(params.slug, searchParams?.preview);
  setPageData({
    params,
    searchParams: searchParams || {},
    page,
  });

  return (
    <div
      className={cn(
        "flex flex-col gap-5",
        page.fullWidth ? "w-full" : "container mx-auto"
      )}
    >
      <MdxContent source={page.content} />
    </div>
  );
}
