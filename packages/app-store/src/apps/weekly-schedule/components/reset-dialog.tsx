import { useI18n } from "@vivid/i18n";
import { WeekIdentifier } from "@vivid/types";
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
import { UndoDot } from "lucide-react";
import React from "react";
import { resetWeeklySchedule } from "./actions";
import { getWeekDisplay } from "./utils";

export type ResetDialogProps = {
  appId: string;
  week: WeekIdentifier;
  disabled?: boolean;
  isDefault?: boolean;
  className?: string;
  onConfirm: () => void;
};

export const ResetDialog: React.FC<ResetDialogProps> = ({
  appId,
  week,
  disabled,
  isDefault,
  className,
  onConfirm: onReset,
}) => {
  const t = useI18n("apps");
  const [openConfirmDialog, setOpenConfirmDialog] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const onConfirm = async () => {
    try {
      setLoading(true);
      await toastPromise(resetWeeklySchedule(appId, week), {
        success: t("weeklySchedule.dialogs.reset.success", {
          week: getWeekDisplay(week),
        }),
        error: t("weeklySchedule.statusText.request_error"),
      });

      setOpenConfirmDialog(false);
      onReset();
    } catch (error: any) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={openConfirmDialog} onOpenChange={setOpenConfirmDialog}>
      <AlertDialogTrigger asChild>
        <Button
          variant="secondary"
          disabled={disabled || isDefault}
          className={className}
        >
          {!isDefault ? (
            <>
              <UndoDot /> {t("weeklySchedule.dialogs.reset.resetToDefault")}
            </>
          ) : (
            t("weeklySchedule.dialogs.reset.defaultSchedule")
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {t("weeklySchedule.dialogs.reset.title")}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t("weeklySchedule.dialogs.reset.description", {
              week: getWeekDisplay(week),
            })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            {t("weeklySchedule.dialogs.reset.cancel")}
          </AlertDialogCancel>
          <Button
            disabled={loading}
            className="flex flex-row gap-1 items-center"
            onClick={onConfirm}
          >
            {loading && <Spinner />}{" "}
            <span>{t("weeklySchedule.dialogs.reset.reset")}</span>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
