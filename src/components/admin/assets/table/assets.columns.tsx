"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { Asset } from "@/types";
import React from "react";
import { CellAction } from "./cell-action";
import { DateTime } from "luxon";
import Image from "next/image";
import { tableSortHeader } from "@/components/ui/tableSortHeader";

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
    enableSorting: false,
    cell: ({ row }) => (
      <div>
        {row.original.mimeType.startsWith("image/") ? (
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
    id: "filename",
    header: tableSortHeader("File name", "string"),
    accessorFn: (asset) => asset.filename,
  },
  {
    id: "mimeType",
    header: tableSortHeader("File type", "string"),
    accessorFn: (asset) => asset.mimeType,
  },
  {
    accessorFn: (asset) => asset.description || "",
    id: "description",
    header: tableSortHeader("Description", "string"),
  },
  {
    accessorFn: (asset) =>
      DateTime.fromJSDate(asset.uploadedAt).toLocaleString(
        DateTime.DATETIME_MED
      ),
    id: "uploadedAt",
    header: tableSortHeader("Upload time", "date"),
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction asset={row.original} />,
  },
];
