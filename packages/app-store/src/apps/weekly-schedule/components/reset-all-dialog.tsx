import { WeekIdentifier } from "@vivid/types";
import { useI18n } from "@vivid/i18n";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
  Spinner,
  toastPromise,
} from "@vivid/ui";
import { RotateCcw } from "lucide-react";
import React from "react";
import { resetAllWeeklySchedule } from "./actions";
import { getWeekDisplay } from "./utils";

export type ResetAllDialogProps = {
  appId: string;
  week: WeekIdentifier;
  disabled?: boolean;
  className?: string;
  onConfirm: () => void;
};

export const ResetAllDialog: React.FC<ResetAllDialogProps> = ({
  appId,
  week,
  disabled,
  className,
  onConfirm: onResetAll,
}) => {
  const t = useI18n("apps");
  const [openConfirmDialog, setOpenConfirmDialog] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const onConfirm = async () => {
    try {
      setLoading(true);
      await toastPromise(resetAllWeeklySchedule(appId, week), {
        success: t("weeklySchedule.dialogs.resetAll.success", {
          week: getWeekDisplay(week),
        }),
        error: t("weeklySchedule.statusText.request_error"),
      });

      setOpenConfirmDialog(false);
      onResetAll();
    } catch (error: any) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={openConfirmDialog} onOpenChange={setOpenConfirmDialog}>
      <AlertDialogTrigger asChild>
        <Button variant="secondary" disabled={disabled} className={className}>
          <RotateCcw /> {t("weeklySchedule.dialogs.resetAll.resetAllToDefault")}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {t("weeklySchedule.dialogs.resetAll.title")}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t("weeklySchedule.dialogs.resetAll.description", {
              week: getWeekDisplay(week),
            })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            {t("weeklySchedule.dialogs.resetAll.cancel")}
          </AlertDialogCancel>
          <Button
            disabled={loading}
            className="flex flex-row gap-1 items-center"
            onClick={onConfirm}
          >
            {loading && <Spinner />}{" "}
            <span>{t("weeklySchedule.dialogs.resetAll.reset")}</span>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
