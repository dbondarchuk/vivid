"use client";
import { AlertModal } from "@/components/modal/alert-modal";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Page } from "@/types";
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { deletePage } from "../actions";
import { useToast } from "@/components/ui/use-toast";

import copy from "copy-text-to-clipboard";

interface CellActionProps {
  page: Page;
}

export const CellAction: React.FC<CellActionProps> = ({ page: page }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const copyRelative = () => {
    const url = `/${page.slug}`;
    copy(url);

    toast({
      variant: "default",
      title: "Copied",
      description: `Page relative url '${url}' was copied to cliipboard.`,
    });
  };

  const copyAbsolute = () => {
    const url = `${window.location.origin}/${page.slug}`;
    copy(url);

    toast({
      variant: "default",
      title: "Copied",
      description: `Page absolute url '${url}' was copied to cliipboard.`,
    });
  };

  const onConfirm = async () => {
    try {
      setLoading(true);
      await deletePage(page._id);
      router.refresh();

      toast({
        variant: "default",
        title: "Deleted",
        description: `Page '${page.slug}' was deleted.`,
      });
    } catch (error: any) {
      setLoading(false);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
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

          <DropdownMenuItem
            onClick={() => router.push(`/admin/dashboard/pages/${page._id}`)}
          >
            <Edit className="mr-2 h-4 w-4" /> Update
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={copyRelative}>
            <Copy className="mr-2 h-4 w-4" /> Copy relative url
          </DropdownMenuItem>
          <DropdownMenuItem onClick={copyAbsolute}>
            <Copy className="mr-2 h-4 w-4" /> Copy absolute url
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
