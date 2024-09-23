import { Breadcrumbs } from "@/components/admin/layout/breadcrumbs";
import PageContainer from "@/components/admin/layout/page-container";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Editor } from "../editor";
import { TailwindEditor } from "../tailwindEditor";
import { Header } from "@/components/web/header/Header";
import { Footer } from "@/components/web/footer/Footer";

const breadcrumbItems = [
  { title: "Dashboard", link: "/admin/dashboard" },
  { title: "Pages", link: "/admin/dashboard/pages" },
  { title: "New", link: "/admin/dashboard/new" },
];

const path = "/";

export default async function NewPagePage() {
  const header = await Header({});
  const footer = await Footer({});
  return (
    <PageContainer scrollable={true}>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2 justify-between">
          <Breadcrumbs items={breadcrumbItems} />
          <Heading title="New page" description="Create new page" />
          <Separator />
        </div>
        <Editor path={path} header={header} footer={footer} />
        {/* <TailwindEditor /> */}
      </div>
    </PageContainer>
  );
}
