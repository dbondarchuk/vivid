import PageContainer from "@/components/admin/layout/page-container";
import { getI18nAsync } from "@vivid/i18n";
import { getLoggerFactory } from "@vivid/logger";
import { Heading, Link, Skeleton } from "@vivid/ui";
import { Copy } from "lucide-react";
import { Suspense } from "react";
import { TemplateFormPage } from "../form-page";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function UpdateTemplatePage(props: Props) {
  const logger = getLoggerFactory("AdminPages")("edit-template");
  const t = await getI18nAsync("admin");
  const { id } = await props.params;

  logger.debug(
    {
      templateId: id,
    },
    "Loading template edit page"
  );

  return (
    <PageContainer scrollable={true}>
      <div className="flex flex-1 flex-col gap-4 h-full">
        <div className="flex flex-col gap-4 justify-between">
          <div className="flex items-center justify-between">
            <Heading title={t("templates.editPage.title")} />
            <Link
              button
              href={`/admin/dashboard/templates/${id}/clone`}
              variant="default"
            >
              <Copy className="mr-2 h-4 w-4" /> {t("templates.editPage.clone")}
            </Link>
          </div>
        </div>
        <Suspense fallback={<Skeleton className="w-full h-full" />}>
          <TemplateFormPage id={id} />
        </Suspense>
      </div>
    </PageContainer>
  );
}
