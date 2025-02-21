import { ConnectedAppRow } from "@/components/admin/apps/connected-app";
import PageContainer from "@/components/admin/layout/page-container";
import { AvailableApps } from "@vivid/app-store";
import { ServicesContainer } from "@vivid/services";
import { Breadcrumbs, Heading, Link, Separator } from "@vivid/ui";
import { Boxes, Store } from "lucide-react";

type Params = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const breadcrumbItems = [
  { title: "Dashboard", link: "/admin/dashboard" },
  { title: "Apps", link: "/admin/dashboard/apps" },
];

export default async function AppsPage(props: Params) {
  const apps = (await ServicesContainer.ConnectedAppService().getApps()).filter(
    (app) => !AvailableApps[app.name].isHidden
  );

  return (
    <PageContainer scrollable={true}>
      <div className="flex flex-1 flex-col gap-8">
        <div className="flex flex-col gap-4 justify-between">
          <Breadcrumbs items={breadcrumbItems} />
          <div className="flex items-start justify-between">
            <Heading
              title="Connected apps"
              description="Manage your connected apps"
            />

            <div className="flex flex-row gap-2 items-center">
              <Link
                variant="primary"
                button
                href="/admin/dashboard/apps/default"
              >
                <Boxes className="mr-2 h-4 w-4" /> Default apps
              </Link>
              <Link variant="default" button href="/admin/dashboard/apps/store">
                <Store className="mr-2 h-4 w-4" /> App Store
              </Link>
            </div>
          </div>
          <Separator />
        </div>
        {apps.map((app) => (
          <ConnectedAppRow app={app} key={app._id} />
        ))}
        {apps.length === 0 && (
          <div className="">You do not have any connected apps</div>
        )}
      </div>
    </PageContainer>
  );
}
