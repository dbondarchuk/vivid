import { Breadcrumbs } from "@/components/admin/layout/breadcrumbs";
import PageContainer from "@/components/admin/layout/pageContainer";
import { ServicesContainer } from "@vivid/services";
import { Heading, Separator } from "@vivid/ui";
import { StylingsConfigurationForm } from "./form";

const breadcrumbItems = [
  { title: "Dashboard", link: "/admin/dashboard" },
  { title: "Appearence", link: "/admin/dashboard" },
  { title: "Styling", link: "/admin/dashboard/appearence/styling" },
];

export default async function Page() {
  const settings =
    await ServicesContainer.ConfigurationService().getConfiguration("styling");

  return (
    <PageContainer scrollable={true}>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2 justify-between">
          <Breadcrumbs items={breadcrumbItems} />
          <Heading title="Styling" description="Adjust general styling" />
          <Separator />
        </div>
        <StylingsConfigurationForm values={settings} />
      </div>
    </PageContainer>
  );
}
