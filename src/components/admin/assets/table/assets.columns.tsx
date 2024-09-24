"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { Asset } from "@/types";
import React from "react";
import { mimeType } from "mime-type/with-db";
import { CellAction } from "./cell-action";
import { DateTime } from "luxon";
import Image from "next/image";

export const columns: ColumnDef<Asset>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    header: "Preview",
    cell: ({ row }) => (
      <div>
        {mimeType
          .lookup(row.original.filename)
          ?.toString()
          .startsWith("image/") ? (
          <Image
            src={`/assets/${row.original.filename}`}
            width={64}
            height={64}
            alt={row.original.description || row.original.filename}
          />
        ) : (
          <></>
        )}
      </div>
    ),
  },
  {
    header: "File name",
    accessorFn: (asset) => asset.filename,
  },
  {
    header: "File type",
    accessorFn: (asset) => mimeType.lookup(asset.filename),
  },
  {
    accessorFn: (asset) => asset.description || "",
    header: "Description",
  },
  {
    accessorFn: (asset) =>
      DateTime.fromJSDate(asset.uploadedAt).toLocaleString(
        DateTime.DATETIME_MED
      ),
    header: "Upload time",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction asset={row.original} />,
  },
];
