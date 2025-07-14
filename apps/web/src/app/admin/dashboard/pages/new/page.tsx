import PageContainer from "@/components/admin/layout/page-container";
import { PageForm } from "@/components/admin/pages/form";
import { getI18nAsync } from "@vivid/i18n/server";
import { getLoggerFactory } from "@vivid/logger";
import { Styling } from "@vivid/page-builder";
import { ServicesContainer } from "@vivid/services";
import { Breadcrumbs, Heading } from "@vivid/ui";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getI18nAsync("admin");
  return {
    title: t("pages.new"),
  };
}

export default async function NewPagesPage() {
  const logger = getLoggerFactory("AdminPages")("new-page");
  const t = await getI18nAsync("admin");

  logger.debug("Loading new page creation page");

  const styling =
    await ServicesContainer.ConfigurationService().getConfiguration("styling");

  return (
    <PageContainer scrollable={true}>
      <Styling styling={styling} />
      <PageForm />
    </PageContainer>
  );
}
