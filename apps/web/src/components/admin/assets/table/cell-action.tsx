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
  useToast,
} from "@vivid/ui";
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteAsset } from "../actions";

import copy from "copy-text-to-clipboard";

interface CellActionProps {
  asset: Asset;
}

export const CellAction: React.FC<CellActionProps> = ({ asset }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const copyRelative = () => {
    const url = `/assets/${asset.filename}`;
    copy(url);

    toast({
      variant: "default",
      title: "Copied",
      description: `Asset relative url '${url}' was copied to cliipboard.`,
    });
  };

  const copyAbsolute = () => {
    const url = `${window.location.origin}/assets/${asset.filename}`;
    copy(url);

    toast({
      variant: "default",
      title: "Copied",
      description: `Asset absolute url '${url}' was copied to cliipboard.`,
    });
  };

  const onConfirm = async () => {
    try {
      setLoading(true);
      await deleteAsset(asset._id);
      router.refresh();

      toast({
        variant: "default",
        title: "Deleted",
        description: `Asset '${asset.filename}' was deleted.`,
      });

      setOpen(false);
    } catch (error: any) {
      setLoading(false);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
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

          <DropdownMenuItem
            onClick={() => router.push(`/admin/dashboard/assets/${asset._id}`)}
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
