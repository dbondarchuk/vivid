import PageContainer from "@/components/admin/layout/page-container";
import { PageFooterForm } from "@/components/admin/pages/footers/form";
import { Styling } from "@vivid/page-builder";
import { getI18nAsync } from "@vivid/i18n/server";
import { getLoggerFactory } from "@vivid/logger";
import { ServicesContainer } from "@vivid/services";
import { Metadata } from "next";
import { formatArguments } from "@vivid/utils";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getI18nAsync("admin");
  return {
    title: t("pages.footers.new"),
  };
}

export default async function NewPageFooterPage() {
  const logger = getLoggerFactory("AdminPageFooters")("new-page-footer");

  logger.debug("Loading new page footer creation page");

  const { general, social, styling } =
    await ServicesContainer.ConfigurationService().getConfigurations(
      "general",
      "social",
      "styling"
    );

  const args = formatArguments(
    {
      general,
      social,
      now: new Date(),
    },
    general.language
  );

  return (
    <PageContainer scrollable={true}>
      <Styling styling={styling} />
      <PageFooterForm args={args} />
    </PageContainer>
  );
}
