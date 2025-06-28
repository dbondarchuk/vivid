"use client";
import { useI18n } from "@vivid/i18n";
import { AppointmentOption } from "@vivid/types";
import {
  AlertModal,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  toastPromise,
} from "@vivid/ui";
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteOption } from "../actions";

import Link from "next/link";

interface CellActionProps {
  option: AppointmentOption;
}

export const CellAction: React.FC<CellActionProps> = ({ option }) => {
  const t = useI18n("admin");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const onConfirm = async () => {
    try {
      setLoading(true);

      await toastPromise(deleteOption(option._id), {
        success: t("services.options.table.columns.cellAction.optionDeleted", {
          name: option.name,
        }),
        error: t("services.options.table.columns.cellAction.deleteError"),
      });

      setOpen(false);
      router.refresh();
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
            <span className="sr-only">{t("common.openMenu")}</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>
            {t("services.options.table.columns.cellAction.actions")}
          </DropdownMenuLabel>
          <DropdownMenuItem asChild>
            <Link
              href={`/admin/dashboard/services/options/new?from=${option._id}`}
            >
              <Copy className="h-4 w-4" />{" "}
              {t("services.options.table.columns.cellAction.clone")}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />

          <DropdownMenuItem asChild>
            <Link href={`/admin/dashboard/services/options/${option._id}`}>
              <Edit className="h-4 w-4" />{" "}
              {t("services.options.table.columns.cellAction.update")}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className="h-4 w-4" />{" "}
            {t("services.options.table.columns.cellAction.delete")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
