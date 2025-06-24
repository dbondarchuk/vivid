import PageContainer from "@/components/admin/layout/page-container";
import { TemplateTemplates } from "@/components/admin/templates/templates";
import { TemplatesTemplate } from "@/components/admin/templates/templates/type";
import { getI18nAsync } from "@vivid/i18n";
import { getLoggerFactory } from "@vivid/logger";
import { CommunicationChannel } from "@vivid/types";
import { Heading, Skeleton } from "@vivid/ui";
import { Suspense } from "react";
import { TemplateFormPage } from "../../form-page";

type Props = {
  params: Promise<{ type: CommunicationChannel }>;
  searchParams?: Promise<{
    template?: string;
  }>;
};

export default async function NewTemplatePage({ params, searchParams }: Props) {
  const logger = getLoggerFactory("AdminPages")("new-template");
  const t = await getI18nAsync("admin");
  const { type } = await params;
  const query = await searchParams;

  logger.debug(
    {
      type,
      template: query?.template,
    },
    "Loading new template page"
  );

  let template: TemplatesTemplate | undefined = undefined;
  if (query?.template) {
    template = TemplateTemplates[type][query.template];
  }

  logger.debug(
    {
      type,
      template: query?.template,
      hasTemplate: !!template,
    },
    "New template page loaded"
  );

  return (
    <PageContainer scrollable={true}>
      <div className="flex flex-1 flex-col gap-4 h-full">
        <div className="flex flex-col gap-4 justify-between">
          <Heading
            title={t("templates.newPage.title", {
              type: t(`common.labels.channel.${type}`).toLowerCase(),
            })}
          />
        </div>
        <Suspense fallback={<Skeleton className="w-full h-full" />}>
          <TemplateFormPage type={type} template={template} />
        </Suspense>
      </div>
    </PageContainer>
  );
}
