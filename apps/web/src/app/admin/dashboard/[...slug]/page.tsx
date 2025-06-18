import PageContainer from "@/components/admin/layout/page-container";
import { AvailableApps } from "@vivid/app-store";
import { getLoggerFactory } from "@vivid/logger";
import { ServicesContainer } from "@vivid/services";
import { Breadcrumbs, Heading } from "@vivid/ui";
import { redirect } from "next/navigation";

type Props = {
  params: Promise<{ slug: string[] }>;
  searchParams?: Promise<{
    preview?: boolean;
  }>;
};

export default async function Page(props: Props) {
  const logger = getLoggerFactory("AdminDashboardPage")("Page");

  const searchParams = await props.searchParams;
  const params = await props.params;
  const path = params.slug?.join("/").toLocaleLowerCase() || "/";
  logger.debug(
    {
      slug: path,
      searchParams: searchParams,
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
    { title: "Dashboard", link: "/admin/dashboard" },
    { title: "Apps", link: "/admin/dashboard/apps" },
    ...(menuItem.pageBreadcrumbs || [
      {
        title: menuItem.pageTitle || app.displayName,
        link: `/admin/dashboard/${path}`,
      },
    ]),
  ];

  return (
    <PageContainer scrollable={!menuItem.notScrollable}>
      <div className="flex flex-1 flex-col gap-4">
        <div className="flex flex-col gap-4 justify-between">
          <Breadcrumbs items={breadcrumbItems} />
          <Heading
            title={menuItem.pageTitle || app.displayName}
            description={
              menuItem.pageDescription || `Update ${app.displayName} settings`
            }
          />
          {/* <Separator /> */}
        </div>
        <menuItem.Page appId={appId} />
      </div>
    </PageContainer>
  );
}
