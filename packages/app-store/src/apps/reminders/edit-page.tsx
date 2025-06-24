"use client";

import { useI18n } from "@vivid/i18n";
import { ComplexAppSetupProps } from "@vivid/types";
import { ReminderForm } from "./form";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { Reminder } from "./models";
import { getReminder } from "./actions";
import { Skeleton, toast } from "@vivid/ui";

export const EditReminderPage: React.FC<ComplexAppSetupProps> = ({ appId }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");
  const t = useI18n("apps");

  const [loading, setLoading] = React.useState(true);
  const [reminder, setReminder] = React.useState<Reminder>();

  React.useEffect(() => {
    if (!id) {
      router.replace("/admin/dashboard/communications/reminders");
      return;
    }

    const fn = async () => {
      setLoading(true);
      try {
        const result = await getReminder(appId, id);
        if (!result) {
          router.replace("/admin/dashboard/communications/reminders");
          return;
        }

        setReminder(result);
        setLoading(false);
      } catch (e: any) {
        console.error(e);
        toast.error(t("reminders.statusText.error_loading_reminder"));
      } finally {
      }
    };

    fn();
  }, [id]);

  return loading ? (
    <Skeleton className="w-full h-[70vh]" />
  ) : (
    <ReminderForm appId={appId} initialData={reminder} />
  );
};
