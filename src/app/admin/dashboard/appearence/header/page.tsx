import { Breadcrumbs } from "@/components/admin/layout/breadcrumbs";
import PageContainer from "@/components/admin/layout/page-container";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Services } from "@/lib/services";
import { HeaderSettingsForm } from "./form";

const breadcrumbItems = [
  { title: "Dashboard", link: "/admin/dashboard" },
  { title: "Appearence", link: "/admin/dashboard" },
  { title: "Header", link: "/admin/dashboard/appearence/header" },
];

export default async function Page() {
  const settings = await Services.ConfigurationService().getConfiguration(
    "header"
  );

  return (
    <PageContainer scrollable={true}>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2 justify-between">
          <Breadcrumbs items={breadcrumbItems} />
          <Heading
            title="Header menu"
            description="Adjust links and style of the header"
          />
          <Separator />
        </div>
        <HeaderSettingsForm values={settings} />
      </div>
    </PageContainer>
  );
}
