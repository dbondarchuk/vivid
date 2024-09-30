import { Breadcrumbs } from "@/components/admin/layout/breadcrumbs";
import PageContainer from "@/components/admin/layout/page-container";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import React from "react";
import { PageForm } from "../../../../../components/admin/pages/form";
import { Services } from "@/lib/services";
import { notFound } from "next/navigation";
import { Link } from "@/components/ui/link";
import { Eye, Globe } from "lucide-react";

type Props = {
  params: { id: string };
};

const breadcrumbItems = [
  { title: "Dashboard", link: "/admin/dashboard" },
  { title: "Pages", link: "/admin/dashboard/pages" },
  { title: "Edit", link: "/admin/dashboard/pages" },
];

export default async function EditPagesPage({ params }: Props) {
  const page = await Services.PagesService().getPage(params.id);

  if (!page) return notFound();

  return (
    <PageContainer scrollable={true}>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2 justify-between">
          <Breadcrumbs items={breadcrumbItems} />
          <div className="flex items-start justify-between">
            <Heading title="Edit page" description={page.slug} />

            <Link
              button
              href={`/${page.slug}`}
              variant="default"
              target="_blank"
            >
              <Globe className="mr-2 h-4 w-4" /> View page
            </Link>
          </div>
          <Separator />
        </div>
        <PageForm initialData={page} />
      </div>
    </PageContainer>
  );
}
