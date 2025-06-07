import PageContainer from "@/components/admin/layout/page-container";
import { CommunicationChannelTexts } from "@/constants/labels";
import { CommunicationChannel } from "@vivid/types";
import { Heading, Separator, Skeleton } from "@vivid/ui";
import { Suspense } from "react";
import { TemplateFormPage } from "../../form-page";
import { TemplatesTemplate } from "@/components/admin/templates/templates/type";
import { TemplateTemplates } from "@/components/admin/templates/templates";

type Props = {
  params: Promise<{ type: CommunicationChannel }>;
  searchParams?: Promise<{
    template?: string;
  }>;
};

export default async function NewTemplatePage({ params, searchParams }: Props) {
  const { type } = await params;
  const query = await searchParams;

  let template: TemplatesTemplate | undefined = undefined;
  if (query?.template) {
    template = TemplateTemplates[type][query.template];
  }

  return (
    <PageContainer scrollable={true}>
      <div className="flex flex-1 flex-col gap-4 h-full">
        <div className="flex flex-col gap-4 justify-between">
          <Heading
            title={`New ${CommunicationChannelTexts[type].toLowerCase()} template`}
          />
          {/* <Separator /> */}
        </div>
        <Suspense fallback={<Skeleton className="w-full h-full" />}>
          <TemplateFormPage type={type} template={template} />
        </Suspense>
      </div>
    </PageContainer>
  );
}
