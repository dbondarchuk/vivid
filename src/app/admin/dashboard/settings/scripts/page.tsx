import { Breadcrumbs } from "@/components/admin/layout/breadcrumbs";
import PageContainer from "@/components/admin/layout/page-container";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Services } from "@/lib/services";
import { ScriptsSettingsForm } from "./form";

const breadcrumbItems = [
  { title: "Dashboard", link: "/admin/dashboard" },
  { title: "Settings", link: "/admin/dashboard" },
  { title: "Scripts", link: "/admin/dashboard/settings/scripts" },
];

export default async function Page() {
  const settings = await Services.ConfigurationService().getConfiguration(
    "scripts"
  );

  return (
    <PageContainer scrollable={true}>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2 justify-between">
          <Breadcrumbs items={breadcrumbItems} />
          <Heading
            title="Scripts"
            description="Add additional third-party scripts to the website"
          />
          <Separator />
        </div>
        <ScriptsSettingsForm values={settings} />
      </div>
    </PageContainer>
  );
}
