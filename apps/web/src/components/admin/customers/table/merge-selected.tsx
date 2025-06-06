"use client";

import { CustomerListModel } from "@vivid/types";
import {
  Button,
  CustomerSelector,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Label,
  Spinner,
  toastPromise,
} from "@vivid/ui";
import { Merge } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { deleteSelected, mergeSelected } from "../actions";

export const MergeSelectedCustomersButton: React.FC<{
  selected: CustomerListModel[];
}> = ({ selected }) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const [targetCustomerId, setTargetCustomerId] = React.useState<string>();

  const router = useRouter();
  const action = async () => {
    if (!targetCustomerId) return;

    try {
      setIsLoading(true);

      await toastPromise(
        mergeSelected(
          targetCustomerId,
          selected.map((customer) => customer._id)
        ),
        {
          success: "Selected customers have been deleted",
          error: "There was a problem with your request.",
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
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          disabled={isLoading || !selected || !selected.length}
        >
          {isLoading && <Spinner />}
          <Merge className="mr-2 h-4 w-4" />
          <span>Merge selected {selected.length} customer(s)</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Merge selected {selected.length} customer(s)
          </DialogTitle>
          <DialogDescription>Combine customers information</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-2">
          <Label>Target customer</Label>
          <CustomerSelector
            onItemSelect={setTargetCustomerId}
            value={targetCustomerId}
            className="w-full"
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={action}
            variant="default"
            disabled={!targetCustomerId}
          >
            {isLoading && <Spinner />}
            <span>Merge</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
