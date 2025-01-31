import { AvailableApps } from "@/apps";
import { AddOrUpdateAppButton } from "@/components/admin/apps/addOrUpdateAppDialog";
import { ConnectedAppRow } from "@/components/admin/apps/connectedApp";
import { Breadcrumbs } from "@/components/admin/layout/breadcrumbs";
import PageContainer from "@/components/admin/layout/page-container";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Link } from "@/components/ui/link";
import { Separator } from "@/components/ui/separator";
import { Services } from "@/lib/services";
import { Boxes, Plus } from "lucide-react";

type Params = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const breadcrumbItems = [
  { title: "Dashboard", link: "/admin/dashboard" },
  { title: "Apps", link: "/admin/dashboard/apps" },
];

export default async function AppsPage(props: Params) {
  const apps = (await Services.ConnectedAppService().getApps()).filter(
    (app) => !AvailableApps[app.name].isHidden
  );

  return (
    <PageContainer scrollable={true}>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2 justify-between">
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
                <Plus className="mr-2 h-4 w-4" /> Connect new
              </Link>
            </div>
          </div>
        </div>
        <Separator />
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
