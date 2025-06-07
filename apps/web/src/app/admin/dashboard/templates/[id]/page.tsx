import PageContainer from "@/components/admin/layout/page-container";
import { CommunicationChannelTexts } from "@/constants/labels";
import { CommunicationChannel } from "@vivid/types";
import { Heading, Link, Separator, Skeleton } from "@vivid/ui";
import { Suspense } from "react";
import { TemplateFormPage } from "../form-page";
import { Copy } from "lucide-react";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function UpdateTemplatePage(props: Props) {
  const { id } = await props.params;

  return (
    <PageContainer scrollable={true}>
      <div className="flex flex-1 flex-col gap-4 h-full">
        <div className="flex flex-col gap-4 justify-between">
          <div className="flex items-center justify-between">
            <Heading title={`Update template`} />
            <Link
              button
              href={`/admin/dashboard/templates/${id}/clone`}
              variant="default"
            >
              <Copy className="mr-2 h-4 w-4" /> Clone
            </Link>
          </div>
          {/* <Separator /> */}
        </div>
        <Suspense fallback={<Skeleton className="w-full h-full" />}>
          <TemplateFormPage id={id} />
        </Suspense>
      </div>
    </PageContainer>
  );
}
