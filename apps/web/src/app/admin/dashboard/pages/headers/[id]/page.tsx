import PageContainer from "@/components/admin/layout/page-container";

import { PageHeaderForm } from "@/components/admin/pages/headers/form";
import { getI18nAsync } from "@vivid/i18n/server";
import { getLoggerFactory } from "@vivid/logger";
import { ServicesContainer } from "@vivid/services";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";

type Props = {
  params: Promise<{ id: string }>;
};

const getPageHeader = cache(async (id: string) => {
  return await ServicesContainer.PagesService().getPageHeader(id);
});

export async function generateMetadata(props: Props): Promise<Metadata> {
  const t = await getI18nAsync("admin");
  const { id } = await props.params;
  const pageHeader = await getPageHeader(id);
  return {
    title: `${pageHeader?.name} | ${t("pages.headers.title")}`,
  };
}

export default async function EditPageHeaderPage(props: Props) {
  const logger = getLoggerFactory("AdminPageHeaders")("edit-page-header");
  const params = await props.params;

  logger.debug(
    {
      pageId: params.id,
    },
    "Loading page edit page"
  );

  const pageHeader = await getPageHeader(params.id);

  if (!pageHeader) {
    logger.warn({ pageId: params.id }, "Page header not found");
    return notFound();
  }

  logger.debug(
    {
      pageHeaderId: params.id,
      name: pageHeader.name,
    },
    "Page header edit page loaded"
  );

  return (
    <PageContainer scrollable={true}>
      <div className="flex flex-1 flex-col gap-4">
        <PageHeaderForm initialData={pageHeader} />
      </div>
    </PageContainer>
  );
}
