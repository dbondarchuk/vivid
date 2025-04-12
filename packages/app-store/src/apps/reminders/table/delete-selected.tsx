"use client";

import { AlertModal, Button, Spinner, toastPromise } from "@vivid/ui";
import { Trash } from "lucide-react";
import { useQueryState } from "nuqs";
import React from "react";
import { deleteSelectedReminders } from "../actions";
import { Reminder } from "../models";

export const DeleteSelectedRemindersButton: React.FC<{
  appId: string;
  selected: Reminder[];
}> = ({ selected, appId }) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);

  const [_, reload] = useQueryState("ts", { history: "replace" });
  const action = async () => {
    try {
      setIsLoading(true);

      await toastPromise(
        deleteSelectedReminders(
          appId,
          selected.map((r) => r._id)
        ),
        {
          success: "Selected reminders have been deleted",
          error: "There was a problem with your request.",
        }
      );

      reload(`${new Date().valueOf()}`);
      setIsOpen(false);
    } catch (error: any) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="destructive"
        disabled={isLoading || !selected || !selected.length}
        onClick={() => setIsOpen(true)}
      >
        {isLoading && <Spinner />}
        <Trash className="mr-2 h-4 w-4" />
        <span>Delete selected {selected.length} reminder(s)</span>
      </Button>
      <AlertModal
        isOpen={isOpen}
        loading={isLoading}
        onClose={() => setIsOpen(false)}
        onConfirm={action}
        description="This action cannot be undone. This will delete selected reminders and
            remove them from all options and addons that use them"
      />
    </>
  );
};
