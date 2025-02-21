import { AppDetails } from "@/components/admin/apps/store/app-details";
import PageContainer from "@/components/admin/layout/page-container";
import { AvailableApps } from "@vivid/app-store";
import { Breadcrumbs } from "@vivid/ui";

type Params = {
  params: Promise<{ appName: string }>;
};

export default async function AppsStorePage(props: Params) {
  const { appName } = await props.params;
  const breadcrumbItems = [
    { title: "Dashboard", link: "/admin/dashboard" },
    { title: "Apps", link: "/admin/dashboard/apps" },
    { title: "Apps Store", link: "/admin/dashboard/apps/store" },
    {
      title: AvailableApps[appName].displayName,
      link: `/admin/dashboard/apps/store/${appName}`,
    },
  ];

  return (
    <PageContainer scrollable={true}>
      <Breadcrumbs items={breadcrumbItems} />
      <AppDetails appName={appName} />
    </PageContainer>
  );
}
