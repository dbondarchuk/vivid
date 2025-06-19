"use client";

import { ComplexAppSetupProps } from "@vivid/types";
import { FollowUpForm } from "./form";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { FollowUp } from "./models";
import { getFollowUp } from "./actions";
import { Skeleton, toast } from "@vivid/ui";

export const EditFollowUpPage: React.FC<ComplexAppSetupProps> = ({ appId }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");

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
        toast.error("Failed to load the follow-up");
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
