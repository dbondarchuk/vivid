"use client";
import { useI18n } from "@vivid/i18n";
import { TemplateListModel } from "@vivid/types";
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
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteTemplate } from "../actions";

interface CellActionProps {
  template: TemplateListModel;
}

export const CellAction: React.FC<CellActionProps> = ({ template }) => {
  const t = useI18n("admin");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const onConfirm = async () => {
    try {
      setLoading(true);

      await toastPromise(deleteTemplate(template._id), {
        success: t("templates.table.cellAction.templateDeleted", {
          name: template.name,
        }),
        error: t("templates.table.cellAction.deleteError"),
      });

      router.refresh();
      setOpen(false);
    } catch (error: any) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-right">
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
            {t("templates.table.cellAction.actions")}
          </DropdownMenuLabel>

          <DropdownMenuItem asChild>
            <Link href={`/admin/dashboard/templates/${template._id}`}>
              <Edit className="h-4 w-4" />{" "}
              {t("templates.table.cellAction.update")}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className="h-4 w-4" />{" "}
            {t("templates.table.cellAction.delete")}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href={`/admin/dashboard/templates/${template._id}/clone`}>
              <Copy className="h-4 w-4" />{" "}
              {t("templates.table.cellAction.clone")}
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
