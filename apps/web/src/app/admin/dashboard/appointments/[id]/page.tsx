import PageContainer from "@/components/admin/layout/page-container";
import { Skeleton } from "@vivid/ui";
import { getLoggerFactory } from "@vivid/logger";
import { Suspense } from "react";
import { AppointmentViewWrapper } from "./appointment-view-wrapper";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ decline?: any }>;
};

export default async function AppointmentPage(props: Props) {
  const logger = getLoggerFactory("AdminPages")("appointment-detail");
  const { id } = await props.params;
  const searchParams = await props.searchParams;
  const shouldShowDeclineModal = "decline" in searchParams;

  logger.debug(
    {
      appointmentId: id,
      shouldShowDeclineModal,
    },
    "Loading appointment detail page"
  );

  return (
    <PageContainer scrollable={true}>
      <Suspense
        fallback={
          <div className="flex flex-1 flex-col gap-4">
            <div className="flex flex-col gap-4 justify-between">
              <div className="flex flex-col gap-2">
                <Skeleton className="w-full max-w-80 h-9" />
                <Skeleton className="w-full max-w-80 h-5" />
              </div>
            </div>
            <Skeleton className="w-full max-h-svh h-full min-h-96" />
          </div>
        }
      >
        <AppointmentViewWrapper
          appointmentId={id}
          shouldShowDeclineModal={shouldShowDeclineModal}
        />
      </Suspense>
    </PageContainer>
  );
}
