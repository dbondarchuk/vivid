import PageContainer from "@/components/admin/layout/page-container";
import { Breadcrumbs, Heading, Separator } from "@vivid/ui";
import { PageForm } from "../../../../../components/admin/pages/form";

import { ServicesContainer } from "@vivid/services";
import { Link } from "@vivid/ui";
import { getLoggerFactory } from "@vivid/logger";
import { getI18nAsync } from "@vivid/i18n";
import { Globe } from "lucide-react";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ id: string }>;
};

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

  const page = await ServicesContainer.PagesService().getPage(params.id);

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

  const breadcrumbItems = [
    { title: t("assets.dashboard"), link: "/admin/dashboard" },
    { title: t("pages.title"), link: "/admin/dashboard/pages" },
    { title: `/${page.slug}`, link: `/admin/dashboard/pages/${params.id}` },
  ];

  return (
    <PageContainer scrollable={true}>
      <div className="flex flex-1 flex-col gap-4">
        <div className="flex flex-col gap-4 justify-between">
          <Breadcrumbs items={breadcrumbItems} />
          <div className="flex items-center justify-between">
            <Heading title={t("pages.edit")} description={`/${page.slug}`} />

            <Link
              button
              href={`/${page.slug}?preview=true`}
              variant="default"
              target="_blank"
            >
              <Globe className="mr-2 h-4 w-4" /> {t("pages.viewPage")}
            </Link>
          </div>
          {/* <Separator /> */}
        </div>
        <PageForm initialData={page} />
      </div>
    </PageContainer>
  );
}
