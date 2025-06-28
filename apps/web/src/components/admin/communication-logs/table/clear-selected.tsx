"use client";

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
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { clearSelectedCommunicationLogs } from "../actions";
import { CommunicationLog } from "@vivid/types";

export const ClearSelectedCommunicationLogsButton: React.FC<{
  selected: CommunicationLog[];
}> = ({ selected }) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);

  const router = useRouter();
  const t = useI18n("admin");
  const action = async () => {
    try {
      setIsLoading(true);

      await toastPromise(
        clearSelectedCommunicationLogs(selected.map((log) => log._id)),
        {
          success: t("communicationLogs.selectedLogsCleared"),
          error: t("common.toasts.error"),
        }
      );

      router.refresh();
      setIsOpen(false);
    } catch (error: any) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog onOpenChange={setIsOpen} open={isOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="default"
          disabled={isLoading || !selected || !selected.length}
        >
          {isLoading && <Spinner />}
          <Trash className="mr-2 h-4 w-4" />
          <span>
            {t("communicationLogs.clearSelectedCount", {
              count: selected.length,
            })}
          </span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {t("communicationLogs.clearSelectedTitle")}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t("communicationLogs.clearSelectedDescription")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("communicationLogs.cancel")}</AlertDialogCancel>
          <Button onClick={action} variant="default">
            {isLoading && <Spinner />}
            <span>{t("communicationLogs.clearSelected")}</span>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
