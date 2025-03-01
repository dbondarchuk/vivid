"use client";
import { AlertModal } from "@/components/modal/alert-modal";
import { Asset } from "@vivid/types";
import {
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

  const copyRelative = () => {
    const url = `/assets/${asset.filename}`;
    copy(url);

    toast.info("Copied", {
      icon: <Copy />,
      description: `Asset relative url '${url}' was copied to cliipboard.`,
    });
  };

  const copyAbsolute = () => {
    const url = `${window.location.origin}/assets/${asset.filename}`;
    copy(url);

    toast.info("Copied", {
      description: `Asset absolute url '${url}' was copied to cliipboard.`,
      icon: <Copy />,
    });
  };

  const onConfirm = async () => {
    try {
      setLoading(true);

      await toastPromise(deleteAsset(asset._id), {
        success: `Asset ${asset.filename} was successfully deleted.`,
        error: "There was a problem with your request.",
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
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          <DropdownMenuItem asChild>
            <Link href={`/admin/dashboard/assets/${asset._id}`}>
              <Edit className="h-4 w-4" /> Update
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className="h-4 w-4" /> Delete
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={copyRelative}>
            <Copy className="h-4 w-4" /> Copy relative url
          </DropdownMenuItem>
          <DropdownMenuItem onClick={copyAbsolute}>
            <Copy className="h-4 w-4" /> Copy absolute url
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href={`/assets/${asset.filename}`} target="_blank">
              <Download className="h-4 w-4" /> Download
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
