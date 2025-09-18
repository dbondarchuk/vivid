"use client";
import { useI18n } from "@vivid/i18n";
import { Asset } from "@vivid/types";
import {
  AlertModal,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  toast,
  toastPromise,
} from "@vivid/ui";
import { Copy, Download, Edit, MoreHorizontal, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteAsset } from "../actions";

import copy from "copy-text-to-clipboard";
import Link from "next/link";

interface CellActionProps {
  asset: Asset;
}

export const CellAction: React.FC<CellActionProps> = ({ asset }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const t = useI18n("admin");

  const copyRelative = () => {
    const url = `/assets/${asset.filename}`;
    copy(url);

    toast.info(t("assets.toasts.copied"), {
      icon: <Copy />,
      description: t("assets.toasts.relativeUrlCopied", { url }),
    });
  };

  const copyAbsolute = () => {
    const url = `${window.location.origin}/assets/${asset.filename}`;
    copy(url);

    toast.info(t("assets.toasts.copied"), {
      description: t("assets.toasts.absoluteUrlCopied", { url }),
      icon: <Copy />,
    });
  };

  const onConfirm = async () => {
    try {
      setLoading(true);

      await toastPromise(deleteAsset(asset._id), {
        success: t("assets.toasts.assetDeleted", { filename: asset.filename }),
        error: t("common.toasts.error"),
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
            <span className="sr-only">
              {t("assets.table.actions.openMenu")}
            </span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>
            {t("assets.table.actions.actions")}
          </DropdownMenuLabel>

          <DropdownMenuItem asChild>
            <Link href={`/admin/dashboard/assets/${asset._id}`}>
              <Edit className="h-4 w-4" /> {t("assets.table.actions.update")}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className="h-4 w-4" /> {t("assets.table.actions.delete")}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={copyRelative}>
            <Copy className="h-4 w-4" />{" "}
            {t("assets.table.actions.copyRelativeUrl")}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={copyAbsolute}>
            <Copy className="h-4 w-4" />{" "}
            {t("assets.table.actions.copyAbsoluteUrl")}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href={`/assets/${asset.filename}`} target="_blank">
              <Download className="h-4 w-4" />{" "}
              {t("assets.table.actions.download")}
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
