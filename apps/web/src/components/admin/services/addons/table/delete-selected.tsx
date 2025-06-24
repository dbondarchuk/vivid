"use client";

import { useI18n } from "@vivid/i18n";
import { AppointmentAddon } from "@vivid/types";
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
import { deleteSelected } from "../actions";

export const DeleteSelectedAddonsButton: React.FC<{
  selected: AppointmentAddon[];
}> = ({ selected }) => {
  const t = useI18n("admin");
  const [isLoading, setIsLoading] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);

  const router = useRouter();
  const action = async () => {
    try {
      setIsLoading(true);

      await toastPromise(deleteSelected(selected.map((page) => page._id)), {
        success: t("services.addons.deleteSelected.success", {
          count: selected.length,
        }),
        error: t("services.addons.deleteSelected.error"),
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
        <Button
          variant="default"
          disabled={isLoading || !selected || !selected.length}
        >
          {isLoading && <Spinner />}
          <Trash className="mr-2 h-4 w-4" />
          <span>
            {t("services.addons.deleteSelected.button", {
              count: selected.length,
            })}
          </span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {t("services.addons.deleteSelected.confirmTitle")}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t("services.addons.deleteSelected.confirmDescription")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            {t("services.addons.deleteSelected.cancel")}
          </AlertDialogCancel>
          <Button onClick={action} variant="default">
            {isLoading && <Spinner />}
            <span>{t("services.addons.deleteSelected.deleteSelected")}</span>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
