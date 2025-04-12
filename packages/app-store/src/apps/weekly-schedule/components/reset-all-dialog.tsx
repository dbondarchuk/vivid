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
  const [openConfirmDialog, setOpenConfirmDialog] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const onConfirm = async () => {
    try {
      setLoading(true);
      await toastPromise(resetAllWeeklySchedule(appId, week), {
        success: `All weekly schedules for week of ${getWeekDisplay(week)} and forward were successfully reset to the default`,
        error: "There was a problem with your request.",
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
          <RotateCcw /> Reset all
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will reset all existing schedules
            starting from the week of {getWeekDisplay(week)} to the default one.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            disabled={loading}
            className="flex flex-row gap-1 items-center"
            onClick={onConfirm}
          >
            {loading && <Spinner />} <span>Reset</span>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
