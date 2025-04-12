"use client";

import { WeekIdentifier } from "@vivid/types";
import {
  Dialog,
  DialogTrigger,
  Button,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  Spinner,
  toastPromise,
  Label,
  WeekSelector,
} from "@vivid/ui";
import { Copy } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { copyWeeklySchedule } from "./actions";
import { getWeekDisplay } from "./utils";
import { getWeekIdentifier } from "@vivid/utils";

type CopyScheduleDialogProps = {
  appId: string;
  week: WeekIdentifier;
  disabled?: boolean;
  className?: string;
};

export const CopyScheduleDialog: React.FC<CopyScheduleDialogProps> = ({
  appId,
  week,
  disabled,
  className,
}) => {
  const [openDialog, setOpenDialog] = React.useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const [newWeek, setNewWeek] = React.useState(week);

  const router = useRouter();
  const todayWeek = getWeekIdentifier(new Date());

  const onConfirm = async () => {
    try {
      setLoading(true);
      await toastPromise(copyWeeklySchedule(appId, week, newWeek), {
        success: `Schedule for week of ${getWeekDisplay(week)} was successfully copied to week of ${getWeekDisplay(newWeek)}`,
        error: "There was a problem with your request.",
      });

      setOpenConfirmDialog(false);
      setOpenDialog(false);

      router.push(`?week=${newWeek}`);
    } catch (error: any) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const id = React.useId();

  return (
    <Dialog onOpenChange={setOpenDialog} open={openDialog}>
      <DialogTrigger asChild>
        <Button variant="primary" disabled={disabled} className={className}>
          <Copy /> Copy schedule
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col max-h-[100%] translate-y-[-100%]">
        <DialogHeader>
          <DialogTitle className="w-full flex flex-row justify-between items-center mt-2">
            Copy weekly schedule
          </DialogTitle>
          <DialogDescription>
            Copy this weekly schedule to another week
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 flex flex-col gap-2 w-full overflow-auto">
          <Label htmlFor={id}>Target week</Label>
          <WeekSelector
            initialWeek={newWeek}
            onWeekChange={setNewWeek}
            minWeek={todayWeek}
          />
        </div>
        <DialogFooter className="!justify-between flex-row gap-2">
          <DialogClose asChild>
            <Button variant="secondary">Close</Button>
          </DialogClose>
          <AlertDialog
            open={openConfirmDialog}
            onOpenChange={setOpenConfirmDialog}
          >
            <AlertDialogTrigger asChild>
              <Button variant="default" disabled={week === newWeek}>
                Copy
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will replace existing
                  schedules for the week of {getWeekDisplay(newWeek)}.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <Button
                  disabled={loading}
                  className="flex flex-row gap-1 items-center"
                  onClick={onConfirm}
                >
                  {loading && <Spinner />} <span>Copy</span>
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
