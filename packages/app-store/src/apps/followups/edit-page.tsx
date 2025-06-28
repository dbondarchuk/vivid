"use client";

import { ComplexAppSetupProps } from "@vivid/types";
import { FollowUpForm } from "./form";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { FollowUp } from "./models";
import { getFollowUp } from "./actions";
import { Skeleton, toast } from "@vivid/ui";
import { useI18n } from "@vivid/i18n";

export const EditFollowUpPage: React.FC<ComplexAppSetupProps> = ({ appId }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");
  const t = useI18n("apps");
  const [loading, setLoading] = React.useState(true);
  const [followUp, setFollowUp] = React.useState<FollowUp>();

  React.useEffect(() => {
    if (!id) {
      router.replace("/admin/dashboard/communications/follow-ups");
      return;
    }

    const fn = async () => {
      setLoading(true);
      try {
        const result = await getFollowUp(appId, id);
        if (!result) {
          router.replace("/admin/dashboard/communications/follow-ups");
          return;
        }

        setFollowUp(result);
        setLoading(false);
      } catch (e: any) {
        console.error(e);
        toast.error(t("followUps.statusText.error_loading_follow_up"));
      } finally {
      }
    };

    fn();
  }, [id]);

  return loading ? (
    <Skeleton className="w-full h-[70vh]" />
  ) : (
    <FollowUpForm appId={appId} initialData={followUp} />
  );
};
