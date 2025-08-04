import PageContainer from "@/components/admin/layout/page-container";
import { Breadcrumbs, Heading, Separator } from "@vivid/ui";
import { PageForm } from "../../../../../components/admin/pages/form";

import { ServicesContainer } from "@vivid/services";
import { Link } from "@vivid/ui";
import { getLoggerFactory } from "@vivid/logger";
import { getI18nAsync } from "@vivid/i18n/server";
import { Globe } from "lucide-react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { cache } from "react";
import { Styling } from "@vivid/page-builder";

type Props = {
  params: Promise<{ id: string }>;
};

const getPage = cache(async (id: string) => {
  return await ServicesContainer.PagesService().getPage(id);
});

export async function generateMetadata(props: Props): Promise<Metadata> {
  const t = await getI18nAsync("admin");
  const { id } = await props.params;
  const page = await getPage(id);
  return {
    title: `${page?.title} | ${t("pages.title")}`,
  };
}

export default async function EditPagesPage(props: Props) {
  const logger = getLoggerFactory("AdminPages")("edit-page");
  const t = await getI18nAsync("admin");
  const params = await props.params;

  logger.debug(
    {
      pageId: params.id,
    },
    "Loading page edit page"
  );

  const page = await getPage(params.id);
  const { styling, general, social } =
    await ServicesContainer.ConfigurationService().getConfigurations(
      "styling",
      "general",
      "social"
    );

  if (!page) {
    logger.warn({ pageId: params.id }, "Page not found");
    return notFound();
  }

  logger.debug(
    {
      pageId: params.id,
      pageSlug: page.slug,
      pageTitle: page.title,
      isPublished: page.published,
    },
    "Page edit page loaded"
  );

  return (
    <PageContainer scrollable={true}>
      <div className="flex flex-1 flex-col gap-4">
        <Styling styling={styling} />
        <PageForm initialData={page} config={{ general, social }} />
      </div>
    </PageContainer>
  );
}
