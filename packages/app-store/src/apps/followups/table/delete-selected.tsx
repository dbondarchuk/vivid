"use client";

import { AlertModal, Button, Spinner, toastPromise } from "@vivid/ui";
import { Trash } from "lucide-react";
import { useQueryState } from "nuqs";
import React from "react";
import { deleteFollowUps } from "../actions";
import { FollowUp } from "../models";

export const DeleteSelectedFollowUpsButton: React.FC<{
  appId: string;
  selected: FollowUp[];
}> = ({ selected, appId }) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);

  const [_, reload] = useQueryState("ts", { history: "replace" });
  const action = async () => {
    try {
      setIsLoading(true);

      await toastPromise(
        deleteFollowUps(
          appId,
          selected.map((r) => r._id)
        ),
        {
          success: "Selected follow-ups have been deleted",
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
        <span>Delete selected {selected.length} follow-up(s)</span>
      </Button>
      <AlertModal
        isOpen={isOpen}
        loading={isLoading}
        onClose={() => setIsOpen(false)}
        onConfirm={action}
        description="This action cannot be undone. This will delete selected follow-ups and
            remove them from all options and addons that use them"
      />
    </>
  );
};
