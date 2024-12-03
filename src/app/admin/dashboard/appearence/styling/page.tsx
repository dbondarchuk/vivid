import { Breadcrumbs } from "@/components/admin/layout/breadcrumbs";
import PageContainer from "@/components/admin/layout/page-container";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Services } from "@/lib/services";
import { StylingsConfigurationForm } from "./form";

const breadcrumbItems = [
  { title: "Dashboard", link: "/admin/dashboard" },
  { title: "Appearence", link: "/admin/dashboard" },
  { title: "Styling", link: "/admin/dashboard/appearence/styling" },
];

export default async function Page() {
  const settings = await Services.ConfigurationService().getConfiguration(
    "styling"
  );

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
