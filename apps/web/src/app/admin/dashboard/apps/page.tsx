import PageContainer from "@/components/admin/layout/page-container";
import { Breadcrumbs, Heading, Link, Separator, Skeleton } from "@vivid/ui";
import { getLoggerFactory } from "@vivid/logger";
import { Boxes, Store } from "lucide-react";
import { Suspense } from "react";
import { InstalledApps } from "./installed-apps";
import { getI18nAsync } from "@vivid/i18n/server";

type Params = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function AppsPage(props: Params) {
  const logger = getLoggerFactory("AdminPages")("apps");
  const t = await getI18nAsync("admin");

  logger.debug("Loading apps page");
  const breadcrumbItems = [
    { title: t("navigation.dashboard"), link: "/admin/dashboard" },
    { title: t("navigation.apps"), link: "/admin/dashboard/apps" },
  ];
  return (
    <PageContainer scrollable={true}>
      <div className="flex flex-1 flex-col gap-4">
        <div className="flex flex-col gap-4 justify-between">
          <Breadcrumbs items={breadcrumbItems} />
          <div className="flex items-center justify-between">
            <Heading
              title={t("apps.heading")}
              description={t("apps.description")}
            />

            <div className="flex flex-col [&>a]:max-md:w-full md:flex-row gap-2 items-center">
              <Link
                variant="secondary"
                button
                href="/admin/dashboard/apps/default"
              >
                <Boxes className="mr-2 h-4 w-4" /> {t("apps.defaultApps")}
              </Link>
              <Link variant="default" button href="/admin/dashboard/apps/store">
                <Store className="mr-2 h-4 w-4" /> {t("apps.appStore")}
              </Link>
            </div>
          </div>
        </div>
        <div className="grid  gap-4">
          <Suspense
            fallback={Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="w-full h-32" />
            ))}
          >
            <InstalledApps />
          </Suspense>
        </div>
      </div>
    </PageContainer>
  );
}
