import { Breadcrumbs } from "@/components/admin/layout/breadcrumbs";
import PageContainer from "@/components/admin/layout/pageContainer";
import { ServicesContainer } from "@vivid/services";
import { Heading, Separator } from "@vivid/ui";
import { SocialSettingsForm } from "./form";

const breadcrumbItems = [
  { title: "Dashboard", link: "/admin/dashboard" },
  { title: "Settings", link: "/admin/dashboard" },
  { title: "Social", link: "/admin/dashboard/settings/social" },
];

export default async function Page() {
  const settings =
    await ServicesContainer.ConfigurationService().getConfiguration("social");

  return (
    <PageContainer scrollable={true}>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2 justify-between">
          <Breadcrumbs items={breadcrumbItems} />
          <Heading
            title="Social Settings"
            description="Adjust social links settings"
          />
          <Separator />
        </div>
        <SocialSettingsForm values={settings} />
      </div>
    </PageContainer>
  );
}
