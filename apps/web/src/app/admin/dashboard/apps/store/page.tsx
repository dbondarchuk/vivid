import { AppStore } from "@/components/admin/apps/store/app-store";
import PageContainer from "@/components/admin/layout/page-container";
import { getI18nAsync } from "@vivid/i18n/server";
import { getLoggerFactory } from "@vivid/logger";
import { Breadcrumbs } from "@vivid/ui";
import { Metadata } from "next";

type Params = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(): Promise<Metadata> {
  const t = await getI18nAsync("admin");
  return {
    title: t("apps.appStore"),
  };
}

export default async function AppsStorePage(props: Params) {
  const logger = getLoggerFactory("AdminPages")("store");
  const t = await getI18nAsync("admin");

  logger.debug("Loading store page");
  const breadcrumbItems = [
    { title: t("navigation.dashboard"), link: "/admin/dashboard" },
    { title: t("navigation.apps"), link: "/admin/dashboard/apps" },
    { title: t("apps.appStore"), link: "/admin/dashboard/apps/store" },
  ];

  return (
    <PageContainer scrollable>
      <Breadcrumbs items={breadcrumbItems} />
      <AppStore />
    </PageContainer>
  );
}
