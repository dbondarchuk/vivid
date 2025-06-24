import { AppStore } from "@/components/admin/apps/store/app-store";
import PageContainer from "@/components/admin/layout/page-container";
import { Breadcrumbs } from "@vivid/ui";
import { getLoggerFactory } from "@vivid/logger";
import React from "react";
import { getI18nAsync } from "@vivid/i18n";

type Params = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

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
    <PageContainer scrollable={true}>
      <Breadcrumbs items={breadcrumbItems} />
      <AppStore />
    </PageContainer>
  );
}
