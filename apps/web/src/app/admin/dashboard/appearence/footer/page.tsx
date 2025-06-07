import PageContainer from "@/components/admin/layout/page-container";
import { ServicesContainer } from "@vivid/services";
import { Heading, Separator, Breadcrumbs } from "@vivid/ui";
import { FooterSettingsForm } from "./form";

const breadcrumbItems = [
  { title: "Dashboard", link: "/admin/dashboard" },
  { title: "Appearence", link: "/admin/dashboard" },
  { title: "Footer", link: "/admin/dashboard/appearence/footer" },
];

export default async function Page() {
  const settings =
    await ServicesContainer.ConfigurationService().getConfiguration("footer");

  return (
    <PageContainer scrollable={true}>
      <div className="flex flex-1 flex-col gap-4">
        <div className="flex flex-col gap-4 justify-between">
          <Breadcrumbs items={breadcrumbItems} />
          <Heading title="Footer" description="Adjust links in footer" />
          {/* <Separator /> */}
        </div>
        <FooterSettingsForm values={settings} />
      </div>
    </PageContainer>
  );
}
