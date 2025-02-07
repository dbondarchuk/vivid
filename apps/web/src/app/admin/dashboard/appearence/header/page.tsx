import { Breadcrumbs } from "@/components/admin/layout/breadcrumbs";
import PageContainer from "@/components/admin/layout/pageContainer";
import { ServicesContainer } from "@vivid/services";
import { Heading, Separator } from "@vivid/ui";
import { HeaderSettingsForm } from "./form";

const breadcrumbItems = [
  { title: "Dashboard", link: "/admin/dashboard" },
  { title: "Appearence", link: "/admin/dashboard" },
  { title: "Header", link: "/admin/dashboard/appearence/header" },
];

export default async function Page() {
  const settings =
    await ServicesContainer.ConfigurationService().getConfiguration("header");

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
