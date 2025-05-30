"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Asset } from "@vivid/types";
import {
  AssetPreview,
  Checkbox,
  tableSortHeader,
  tableSortNoopFunction,
} from "@vivid/ui";
import { DateTime } from "luxon";
import { CellAction } from "./cell-action";
import { humanFileSize } from "@vivid/utils";

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
    cell: ({ row }) => <AssetPreview asset={row.original} />,
  },
  {
    id: "filename",
    header: tableSortHeader("File name", "string"),
    accessorFn: (asset) => asset.filename,
    sortingFn: tableSortNoopFunction,
  },
  {
    id: "mimeType",
    header: tableSortHeader("File type", "string"),
    accessorFn: (asset) => asset.mimeType,
    sortingFn: tableSortNoopFunction,
  },
  {
    id: "size",
    header: tableSortHeader("File size", "number"),
    accessorFn: (asset) => humanFileSize(asset.size),
    sortingFn: tableSortNoopFunction,
  },
  {
    accessorFn: (asset) => asset.description || "",
    id: "description",
    header: tableSortHeader("Description", "string"),
    sortingFn: tableSortNoopFunction,
  },
  {
    accessorFn: (asset) =>
      DateTime.fromJSDate(asset.uploadedAt).toLocaleString(
        DateTime.DATETIME_MED
      ),
    id: "uploadedAt",
    header: tableSortHeader("Upload time", "date"),
    sortingFn: tableSortNoopFunction,
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction asset={row.original} />,
  },
];
