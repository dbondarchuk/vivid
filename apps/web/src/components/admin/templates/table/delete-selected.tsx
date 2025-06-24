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
import { deleteSelectedTemplates } from "../actions";
import { Template } from "@vivid/types";

export const DeleteSelectedTemplatesButton: React.FC<{
  selected: Template[];
}> = ({ selected }) => {
  const t = useI18n("admin");
  const [isLoading, setIsLoading] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);

  const router = useRouter();
  const action = async () => {
    try {
      setIsLoading(true);

      await toastPromise(
        deleteSelectedTemplates(selected.map((page) => page._id)),
        {
          success: t("templates.table.deleteSelected.success"),
          error: t("templates.table.deleteSelected.error"),
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
            {t("templates.table.deleteSelected.button", {
              count: selected.length,
            })}
          </span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {t("templates.table.deleteSelected.confirmTitle")}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t("templates.table.deleteSelected.confirmDescription")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            {t("templates.table.deleteSelected.cancel")}
          </AlertDialogCancel>
          <Button onClick={action} variant="default">
            {isLoading && <Spinner />}
            <span>{t("templates.table.deleteSelected.deleteSelected")}</span>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
