import { Breadcrumbs } from "@/components/admin/layout/breadcrumbs";
import PageContainer from "@/components/admin/layout/page-container";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import React from "react";
import { PageForm } from "../../../../../components/admin/pages/form";

const breadcrumbItems = [
  { title: "Dashboard", link: "/admin/dashboard" },
  { title: "Pages", link: "/admin/dashboard/pages" },
  { title: "New", link: "/admin/dashboard/pages/new" },
];

export default async function NewPagesPage() {
  return (
    <PageContainer scrollable={true}>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2 justify-between">
          <Breadcrumbs items={breadcrumbItems} />
          <Heading title="New page" description="Add new page" />
          <Separator />
        </div>
        <PageForm />
      </div>
    </PageContainer>
  );
}
