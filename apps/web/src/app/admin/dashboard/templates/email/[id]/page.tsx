import PageContainer from "@/components/admin/layout/page-container";
import { Heading, Separator, Skeleton } from "@vivid/ui";
import { Suspense } from "react";
import { EmailFormPage } from "../form-page";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function UpdateEmailTemplatePage(props: Props) {
  const { id } = await props.params;

  return (
    <PageContainer scrollable={true}>
      <div className="flex flex-1 flex-col gap-8">
        <div className="flex flex-col gap-4 justify-between">
          <Heading title="Update email template" />
          <Separator />
        </div>
        <Suspense fallback={<Skeleton className="w-full h-full" />}>
          <EmailFormPage id={id} />
        </Suspense>
      </div>
    </PageContainer>
  );
}
