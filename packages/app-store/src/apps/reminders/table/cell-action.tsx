"use client";
import { useI18n } from "@vivid/i18n";
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
import { useQueryState } from "nuqs";
import { useState } from "react";

import { deleteReminder } from "../actions";
import { Reminder } from "../models";

interface CellActionProps {
  reminder: Reminder;
  appId: string;
}

export const CellAction: React.FC<CellActionProps> = ({ reminder, appId }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const t = useI18n("apps");
  const tAdmin = useI18n("admin");

  const [_, reload] = useQueryState("ts", { history: "replace" });

  const onConfirm = async () => {
    try {
      setLoading(true);

      await toastPromise(deleteReminder(appId, reminder._id), {
        success: t("reminders.statusText.reminder_deleted"),
        error: tAdmin("common.toasts.error"),
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
            <span className="sr-only">{tAdmin("common.openMenu")}</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>
            {t("reminders.table.actions.label")}
          </DropdownMenuLabel>
          <DropdownMenuItem asChild>
            <Link
              href={`/admin/dashboard/communications/reminders/edit?id=${reminder._id}`}
            >
              <Edit className="h-4 w-4" /> {t("reminders.table.actions.edit")}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className="h-4 w-4" /> {t("reminders.table.actions.delete")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
