"use client";
import {
  AlertModal,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  toastPromise,
} from "@vivid/ui";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useQueryState } from "nuqs";

import { deleteFollowUps } from "../actions";
import { FollowUp } from "../models";

interface CellActionProps {
  followUp: FollowUp;
  appId: string;
}

export const CellAction: React.FC<CellActionProps> = ({ followUp, appId }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const [_, reload] = useQueryState("ts", { history: "replace" });

  const onConfirm = async () => {
    try {
      setLoading(true);

      await toastPromise(deleteFollowUps(appId, [followUp._id]), {
        success: `Follow-up '${followUp.name}' was deleted.`,
        error: "There was a problem with your request.",
      });

      setOpen(false);
      reload(`${new Date().valueOf()}`);
    } catch (error: any) {
      setLoading(false);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
      />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem asChild>
            <Link
              href={`/admin/dashboard/communications/follow-ups/edit?id=${followUp._id}`}
            >
              <Edit className="h-4 w-4" /> Update
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className="h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
