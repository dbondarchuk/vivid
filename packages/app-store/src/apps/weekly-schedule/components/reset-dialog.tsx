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
  const [openConfirmDialog, setOpenConfirmDialog] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const onConfirm = async () => {
    try {
      setLoading(true);
      await toastPromise(resetWeeklySchedule(appId, week), {
        success: `Weekly schedule for the week of ${getWeekDisplay(week)} was successfully reset to the default`,
        error: "There was a problem with your request.",
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
              <UndoDot /> Reset to default
            </>
          ) : (
            "Default schedule"
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will reset the schedule for the
            week of {getWeekDisplay(week)} to the default one.
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
