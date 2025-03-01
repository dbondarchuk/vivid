"use client";
import { AlertModal } from "@/components/modal/alert-modal";
import { Page } from "@vivid/types";
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
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { deletePage } from "../actions";

import copy from "copy-text-to-clipboard";
import Link from "next/link";

interface CellActionProps {
  page: Page;
}

export const CellAction: React.FC<CellActionProps> = ({ page: page }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const copyRelative = () => {
    const url = `/${page.slug}`;
    copy(url);

    toast.info("Copied", {
      description: `Page relative url '${url}' was copied to cliipboard.`,
      icon: <Copy />,
    });
  };

  const copyAbsolute = () => {
    const url = `${window.location.origin}/${page.slug}`;
    copy(url);

    toast.info("Copied", {
      description: `Page absolute url '${url}' was copied to cliipboard.`,
      icon: <Copy />,
    });
  };

  const onConfirm = async () => {
    try {
      setLoading(true);

      await toastPromise(deletePage(page._id), {
        success: `Page '${page.slug}' was deleted.`,
        error: "There was a problem with your request.",
      });

      router.refresh();
    } catch (error: any) {
      setLoading(false);
      console.error(error);
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
            <Link href={`/admin/dashboard/pages/${page._id}`}>
              <Edit className="h-4 w-4" /> Update
            </Link>
          </DropdownMenuItem>
          {page.slug !== "home" && (
            <DropdownMenuItem onClick={() => setOpen(true)}>
              <Trash className="h-4 w-4" /> Delete
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={copyRelative}>
            <Copy className="h-4 w-4" /> Copy relative url
          </DropdownMenuItem>
          <DropdownMenuItem onClick={copyAbsolute}>
            <Copy className="h-4 w-4" /> Copy absolute url
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
