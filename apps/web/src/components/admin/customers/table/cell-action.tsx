"use client";
import { CustomerListModel } from "@vivid/types";
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
import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteCustomer } from "../actions";

import Link from "next/link";

interface CellActionProps {
  customer: CustomerListModel;
}

export const CellAction: React.FC<CellActionProps> = ({ customer }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const onConfirm = async () => {
    try {
      setLoading(true);

      await toastPromise(deleteCustomer(customer._id), {
        success: `Customer '${customer.name}' was deleted.`,
        error: "There was a problem with your request.",
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
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem asChild>
            <Link href={`/admin/dashboard/customers/${customer._id}`}>
              <Edit className="h-4 w-4" /> Update
            </Link>
          </DropdownMenuItem>
          {customer.appointmentsCount === 0 ? (
            <DropdownMenuItem onClick={() => setOpen(true)}>
              <Trash className="h-4 w-4" /> Delete
            </DropdownMenuItem>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
