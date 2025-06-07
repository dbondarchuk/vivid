import PageContainer from "@/components/admin/layout/page-container";
import { Breadcrumbs, Heading, Separator } from "@vivid/ui";
import { PageForm } from "../../../../../components/admin/pages/form";

import { ServicesContainer } from "@vivid/services";
import { Link } from "@vivid/ui";
import { Globe } from "lucide-react";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditPagesPage(props: Props) {
  const params = await props.params;
  const page = await ServicesContainer.PagesService().getPage(params.id);

  if (!page) return notFound();

  const breadcrumbItems = [
    { title: "Dashboard", link: "/admin/dashboard" },
    { title: "Pages", link: "/admin/dashboard/pages" },
    { title: `/${page.slug}`, link: `/admin/dashboard/pages/${params.id}` },
  ];

  return (
    <PageContainer scrollable={true}>
      <div className="flex flex-1 flex-col gap-4">
        <div className="flex flex-col gap-4 justify-between">
          <Breadcrumbs items={breadcrumbItems} />
          <div className="flex items-center justify-between">
            <Heading title="Edit page" description={`/${page.slug}`} />

            <Link
              button
              href={`/${page.slug}?preview=true`}
              variant="default"
              target="_blank"
            >
              <Globe className="mr-2 h-4 w-4" /> View page
            </Link>
          </div>
          {/* <Separator /> */}
        </div>
        <PageForm initialData={page} />
      </div>
    </PageContainer>
  );
}
