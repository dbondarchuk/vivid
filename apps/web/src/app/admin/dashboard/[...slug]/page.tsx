import { AvailableApps } from "@vivid/app-store";
import PageContainer from "@/components/admin/layout/page-container";
import { Heading, Separator, Breadcrumbs } from "@vivid/ui";
import { ServicesContainer } from "@vivid/services";
import { redirect } from "next/navigation";
import { ComplexApp } from "@vivid/types";

type Props = {
  params: Promise<{ slug: string[] }>;
  searchParams?: Promise<{
    preview?: boolean;
  }>;
};

export default async function Page(props: Props) {
  const searchParams = await props.searchParams;
  const params = await props.params;

  const path = params.slug.join("/").toLocaleLowerCase();
  const app = Object.values(AvailableApps).find(
    (app) =>
      app.type === "complex" && app.menuItem.href.toLocaleLowerCase() === path
  );

  if (!app || app.type !== "complex") {
    redirect("/admin/dashboard");
  }

  const appId = (
    await ServicesContainer.ConnectedAppService().getAppsByApp(app.name)
  )[0]?._id;
  if (!appId) {
    redirect("/admin/dashboard");
  }

  const breadcrumbItems = [
    { title: "Dashboard", link: "/admin/dashboard" },
    { title: "Apps", link: "/admin/dashboard/apps" },
    { title: app.displayName, link: `/admin/dashboard/${path}` },
  ];

  return (
    <PageContainer scrollable={true}>
      <div className="flex flex-1 flex-col gap-8">
        <div className="flex flex-col gap-4 justify-between">
          <Breadcrumbs items={breadcrumbItems} />
          <Heading
            title={app.displayName}
            description={`Update ${app.displayName} settings`}
          />
          <Separator />
        </div>
        {(app as ComplexApp).SetUp({
          appId,
        })}
      </div>
    </PageContainer>
  );
}
