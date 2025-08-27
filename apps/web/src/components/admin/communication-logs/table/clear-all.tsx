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
import { clearAllCommunicationLogs } from "../actions";

export const ClearAllCommunicationLogsButton: React.FC = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);

  const router = useRouter();
  const t = useI18n("admin");
  const action = async () => {
    try {
      setIsLoading(true);

      await toastPromise(clearAllCommunicationLogs(), {
        success: t("communicationLogs.logsCleared"),
        error: t("common.toasts.error"),
      });

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
        <Button variant="default" disabled={isLoading}>
          {isLoading && <Spinner />}
          <Trash className="mr-2 h-4 w-4" />
          <span>{t("communicationLogs.clearAll")}</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {t("communicationLogs.clearAllTitle")}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t("communicationLogs.clearAllDescription")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("communicationLogs.cancel")}</AlertDialogCancel>
          <Button onClick={action} variant="default">
            {isLoading && <Spinner />}
            <span>{t("communicationLogs.clearAll")}</span>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
