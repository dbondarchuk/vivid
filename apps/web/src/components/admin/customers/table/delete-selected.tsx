"use client";

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
  const [isLoading, setIsLoading] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);

  const router = useRouter();
  const action = async () => {
    try {
      setIsLoading(true);

      await toastPromise(deleteSelected(selected.map((page) => page._id)), {
        success: "Selected customers have been deleted",
        error: "There was a problem with your request.",
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
              ? "Cannot delete customers who have assigned appointments"
              : "Delete selected customers"
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
          <span>Delete selected {selected.length} customer(s)</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button onClick={action} variant="default">
            {isLoading && <Spinner />}
            <span>Delete selected</span>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
