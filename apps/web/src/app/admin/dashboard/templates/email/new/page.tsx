import PageContainer from "@/components/admin/layout/page-container";
import { Heading, Separator, Skeleton } from "@vivid/ui";
import { Suspense } from "react";
import { EmailFormPage } from "../form-page";

export default async function NewEmailTemplatePage() {
  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col gap-8">
        <div className="flex flex-col gap-4 justify-between">
          <Heading title="New email template" />
          <Separator />
        </div>
        <Suspense fallback={<Skeleton className="w-full h-full" />}>
          <EmailFormPage />
        </Suspense>
      </div>
    </PageContainer>
  );
}
