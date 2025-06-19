import { getLoggerFactory } from "@vivid/logger";
import { MdxContent } from "@/components/web/mdx/mdx-content";
import { ServicesContainer } from "@vivid/services";
import { cn } from "@vivid/ui";
import { setPageData } from "@vivid/utils";
import { Metadata, ResolvingMetadata } from "next";
import { notFound, redirect } from "next/navigation";
import { cache } from "react";

type Props = {
  params: Promise<{ slug: string[] }>;
  searchParams?: Promise<{
    preview?: boolean;
  }>;
};

export const dynamicParams = true;
export const revalidate = 60;

const getSource = cache(async (slug: string[], preview = false) => {
  const logger = getLoggerFactory("PageComponent")("getSource");

  logger.debug(
    { slug, preview, slugLength: slug?.length },
    "Getting page source"
  );

  if (!slug || !slug.length) {
    logger.debug(
      { originalSlug: slug },
      "No slug provided, defaulting to home"
    );
    slug = ["home"];
  }

  const pageSlug = slug.join("/");

  logger.debug({ pageSlug, preview }, "Retrieving page by slug");

  const page = await ServicesContainer.PagesService().getPageBySlug(pageSlug);

  if (slug.length === 1 && slug[0] === "home" && !page) {
    logger.info({ pageSlug }, "Home page not found, redirecting to install");
    redirect("/install");
  }

  if (
    !page ||
    (!preview && (!page.published || page.publishDate > new Date()))
  ) {
    logger.warn(
      {
        pageSlug,
        preview,
        pageExists: !!page,
        pagePublished: page?.published,
        publishDate: page?.publishDate,
        currentDate: new Date().toISOString(),
      },
      "Page not found or not published"
    );
    notFound();
  }

  logger.debug(
    {
      pageSlug,
      pageId: page._id,
      pageTitle: page.title,
      pagePublished: page.published,
      publishDate: page.publishDate,
    },
    "Successfully retrieved page source"
  );

  return page;
});

export async function generateMetadata(
  props: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const logger = getLoggerFactory("PageComponent")("generateMetadata");

  logger.debug({ hasParent: !!parent }, "Generating page metadata");

  try {
    const searchParams = await props.searchParams;
    const params = await props.params;

    logger.debug(
      {
        slug: params.slug,
        preview: searchParams?.preview,
      },
      "Processing metadata generation request"
    );

    // read route params
    const settings =
      await ServicesContainer.ConfigurationService().getConfiguration(
        "general"
      );

    logger.debug(
      {
        siteTitle: settings.title,
        siteDescription: settings.description?.substring(0, 100) + "...",
      },
      "Retrieved general configuration"
    );

    const page = await getSource(params.slug, searchParams?.preview);

    const title = page.doNotCombine?.title
      ? page.title
      : [settings.title, page.title].filter((x) => !!x).join(" - ");

    const description = page.doNotCombine?.description
      ? page.description
      : [settings.description, page.description].filter((x) => !!x).join("\n");

    const keywords = page.doNotCombine?.keywords
      ? page.keywords
      : [settings.keywords, page.keywords].filter((x) => !!x).join(", ");

    logger.debug(
      {
        pageId: page._id,
        pageTitle: page.title,
        generatedTitle: title,
        doNotCombineTitle: page.doNotCombine?.title,
        doNotCombineDescription: page.doNotCombine?.description,
        doNotCombineKeywords: page.doNotCombine?.keywords,
      },
      "Generated page metadata"
    );

    return {
      title,
      description,
      keywords,
    };
  } catch (error: any) {
    logger.error(
      {
        slug: (await props.params).slug,
        error: error instanceof Error ? error.message : String(error),
      },
      "Error generating page metadata"
    );

    // Return basic metadata on error
    return {
      title: "Error",
      description: "An error occurred while loading the page",
    };
  }
}

export default async function Page(props: Props) {
  const logger = getLoggerFactory("PageComponent")("Page");

  logger.debug({ hasProps: !!props }, "Rendering page component");

  try {
    const searchParams = await props.searchParams;
    const params = await props.params;

    logger.debug(
      {
        slug: params.slug,
        preview: searchParams?.preview,
        slugLength: params.slug?.length,
      },
      "Processing page render request"
    );

    const page = await getSource(params.slug, searchParams?.preview);

    logger.debug(
      {
        pageId: page._id,
        pageTitle: page.title,
        pageFullWidth: page.fullWidth,
        contentLength: page.content?.length || 0,
      },
      "Setting page data and rendering content"
    );

    setPageData({
      params,
      searchParams: searchParams || {},
      page,
    });

    logger.info(
      {
        pageId: page._id,
        pageTitle: page.title,
        pageSlug: params.slug?.join("/") || "home",
        preview: searchParams?.preview,
      },
      "Successfully rendered page"
    );

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
  } catch (error: any) {
    logger.error(
      {
        slug: (await props.params).slug,
        error: error instanceof Error ? error.message : String(error),
      },
      "Error rendering page"
    );

    // Re-throw to let Next.js handle the error
    throw error;
  }
}
