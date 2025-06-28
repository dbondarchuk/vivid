"use client";

import { useI18n } from "@vivid/i18n";
import { CustomerListModel } from "@vivid/types";
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

export const DeleteSelectedCustomersButton: React.FC<{
  selected: CustomerListModel[];
}> = ({ selected }) => {
  const t = useI18n("admin");
  const [isLoading, setIsLoading] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);

  const router = useRouter();
  const action = async () => {
    try {
      setIsLoading(true);

      await toastPromise(deleteSelected(selected.map((page) => page._id)), {
        success: t("customers.table.delete.success"),
        error: t("customers.table.delete.error"),
      });

      router.refresh();
      setIsOpen(false);
    } catch (error: any) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const hasCustomersWithAppointments = selected.some(
    (customer) => customer.appointmentsCount > 0
  );

  return (
    <AlertDialog onOpenChange={setIsOpen} open={isOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="default"
          title={
            hasCustomersWithAppointments
              ? t("customers.table.delete.cannotDeleteWithAppointments")
              : t("customers.table.delete.deleteSelectedCustomers")
          }
          disabled={
            isLoading ||
            !selected ||
            !selected.length ||
            hasCustomersWithAppointments
          }
        >
          {isLoading && <Spinner />}
          <Trash className="mr-2 h-4 w-4" />
          <span>
            {t("customers.table.delete.selectedCount", {
              count: selected.length,
            })}
          </span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {t("customers.table.delete.title")}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t("customers.table.delete.description")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            {t("customers.table.delete.cancel")}
          </AlertDialogCancel>
          <Button onClick={action} variant="default">
            {isLoading && <Spinner />}
            <span>{t("customers.table.delete.confirm")}</span>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
