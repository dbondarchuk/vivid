import { getLoggerFactory } from "@vivid/logger";
import { MdxContent } from "@/components/web/mdx/mdx-content";
import { ServicesContainer } from "@vivid/services";
import { cn } from "@vivid/ui";
import { setPageData } from "@vivid/utils";
import { Metadata, ResolvingMetadata } from "next";
import { notFound, redirect } from "next/navigation";
import { cache } from "react";
import { headers } from "next/headers";

type Props = {
  params: Promise<{ slug: string[] }>;
  searchParams?: Promise<{
    preview?: boolean;
  }>;
};

export const dynamicParams = true;
export const revalidate = 60;

class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}

const getSource = cache(async (slug?: string, preview = false) => {
  const logger = getLoggerFactory("PageComponent")("getSource");

  logger.debug({ slug, preview }, "Getting page source");

  if (!slug || !slug.length) {
    logger.debug(
      { originalSlug: slug },
      "No slug provided, defaulting to home"
    );
    slug = "home";
  }

  logger.debug({ slug, preview }, "Retrieving page by slug");

  const page = await ServicesContainer.PagesService().getPageBySlug(slug);

  if (slug.length === 1 && slug[0] === "home" && !page) {
    logger.info({ slug }, "Home page not found, redirecting to install");
    redirect("/install");
  }

  if (!page) {
    const headersList = await headers();
    const ua = headersList.get("user-agent");
    logger.warn({ slug, ua }, "Page not found, returning 404");
    throw new NotFoundError("Page not found");
  }

  if (!preview && (!page.published || page.publishDate > new Date())) {
    logger.warn(
      {
        slug,
        preview,
        pageExists: !!page,
        pagePublished: page?.published,
        publishDate: page?.publishDate,
        currentDate: new Date().toISOString(),
      },
      "Page not found or not published"
    );
    throw new NotFoundError("Page not found");
  }

  // read route params
  const settings =
    await ServicesContainer.ConfigurationService().getConfiguration("general");

  logger.debug(
    {
      slug,
      pageId: page._id,
      pageTitle: page.title,
      pagePublished: page.published,
      publishDate: page.publishDate,
    },
    "Successfully retrieved page source"
  );

  return { page, settings };
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

    const { page, settings } = await getSource(
      params.slug?.join("/"),
      searchParams?.preview
    );

    logger.debug(
      {
        siteTitle: settings.title,
        siteDescription: settings.description?.substring(0, 100) + "...",
      },
      "Retrieved general configuration"
    );

    const title = page.doNotCombine?.title
      ? page.title
      : [page.title, settings.title].filter((x) => !!x).join(" | ");

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
      icons: {
        icon: settings.favicon || "/icon.ico",
      },
    };
  } catch (error: any) {
    const loggerFn =
      error instanceof NotFoundError ? logger.warn : logger.error;

    loggerFn(
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

    const { page, settings } = await getSource(
      params.slug?.join("/"),
      searchParams?.preview
    );

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
    const loggerFn =
      error instanceof NotFoundError ? logger.warn : logger.error;

    loggerFn(
      {
        slug: (await props.params).slug,
        error: error instanceof Error ? error.message : String(error),
      },
      "Error rendering page"
    );

    if (error instanceof NotFoundError) {
      notFound();
    }

    // Re-throw to let Next.js handle the error
    throw error;
  }
}
