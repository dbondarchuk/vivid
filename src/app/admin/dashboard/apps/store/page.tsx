import { AppStore } from "@/components/admin/apps/store/appStore";
import PageContainer from "@/components/admin/layout/page-container";
import React from "react";

type Params = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

// const breadcrumbItems = [
//   { title: "Dashboard", link: "/admin/dashboard" },
//   { title: "Apps", link: "/admin/dashboard/apps" },
//   { title: "Apps Store", link: "/admin/dashboard/apps/store" },
// ];

export default async function AppsStorePage(props: Params) {
  return (
    <PageContainer scrollable={true}>
      <AppStore />
    </PageContainer>
  );
}
