import PageContainer from "@/components/admin/layout/page-container";
import { AvailableApps } from "@vivid/app-store";
import { getI18nAsync } from "@vivid/i18n/server";
import { getLoggerFactory } from "@vivid/logger";
import { ServicesContainer } from "@vivid/services";
import { Breadcrumbs, Heading } from "@vivid/ui";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { cache } from "react";

type Props = {
  params: Promise<{ slug: string[] }>;
  searchParams?: Promise<{
    preview?: boolean;
  }>;
};

const getAppPage = cache(async (path: string) => {
  const logger = getLoggerFactory("AdminDashboardPage")("getAppPage");
  const t = await getI18nAsync("admin");
  const tApps = await getI18nAsync("apps");

  logger.debug(
    {
      slug: path,
    },
    "Processing dashboard page request"
  );

  const app = Object.values(AvailableApps).find(
    (app) =>
      app.type === "complex" &&
      app.menuItems?.some(({ href }) => href.toLocaleLowerCase() === path)
  );

  if (!app) {
    logger.warn({ path }, "No app found for path");
    redirect("/admin/dashboard");
  }

  const appId = (
    await ServicesContainer.ConnectedAppsService().getAppsByApp(app.name)
  )[0]?._id;
  if (!appId) {
    logger.warn({ appId }, "No app ID found for app");
    redirect("/admin/dashboard");
  }

  const menuItem = app.menuItems?.find(
    ({ href }) => href.toLocaleLowerCase() === path
  );

  if (!menuItem) {
    logger.warn({ path }, "No menu item found for path");
    redirect("/admin/dashboard");
  }

  const breadcrumbItems = [
    { title: t("navigation.dashboard"), link: "/admin/dashboard" },
    { title: t("navigation.apps"), link: "/admin/dashboard/apps" },
    ...(menuItem.pageBreadcrumbs?.map((b) => ({
      ...b,
      title: tApps(b.title, { appName: tApps(app.displayName) }),
    })) || [
      {
        title: tApps(menuItem.pageTitle || app.displayName, {
          appName: tApps(app.displayName),
        }),
        link: `/admin/dashboard/${path}`,
      },
    ]),
  ];

  return {
    title: tApps(menuItem.pageTitle || app.displayName),
    description: tApps(
      menuItem.pageDescription || "common.defaultDescription",
      {
        appName: tApps(app.displayName),
      }
    ),
    breadcrumbItems,
    appId,
    menuItem,
    app,
  };
});

const getSlug = cache(async (props: Props) => {
  const { slug } = await props.params;
  return slug?.join("/").toLocaleLowerCase() || "/";
});

export async function generateMetadata(props: Props): Promise<Metadata> {
  const path = await getSlug(props);
  const appPage = await getAppPage(path);
  return {
    title: appPage.title,
    description: appPage.description,
  };
}

export default async function Page(props: Props) {
  const logger = getLoggerFactory("AdminDashboardPage")("Page");
  const path = await getSlug(props);
  const searchParams = await props.searchParams;

  logger.debug(
    {
      slug: path,
      searchParams: searchParams,
    },
    "Processing dashboard page request"
  );

  const { menuItem, breadcrumbItems, appId, title, description } =
    await getAppPage(path);

  return (
    <PageContainer scrollable={!menuItem.notScrollable}>
      <div className="flex flex-1 flex-col gap-4">
        <div className="flex flex-col gap-4 justify-between">
          <Breadcrumbs items={breadcrumbItems} />
          <Heading title={title} description={description} />
          {/* <Separator /> */}
        </div>
        <menuItem.Page appId={appId} />
      </div>
    </PageContainer>
  );
}
