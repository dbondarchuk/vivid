import { AppDetails } from "@/components/admin/apps/store/appDetails";
import PageContainer from "@/components/admin/layout/pageContainer";
import React from "react";

type Params = {
  params: Promise<{ appName: string }>;
};

// const breadcrumbItems = [
//   { title: "Dashboard", link: "/admin/dashboard" },
//   { title: "Apps", link: "/admin/dashboard/apps" },
//   { title: "Apps Store", link: "/admin/dashboard/apps/store" },
// ];

export default async function AppsStorePage(props: Params) {
  const { appName } = await props.params;

  return (
    <PageContainer scrollable={true}>
      <AppDetails appName={appName} />
    </PageContainer>
  );
}
