"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { Page } from "@/types";
import React from "react";
import { CellAction } from "./cell-action";
import { DateTime } from "luxon";

export const columns: ColumnDef<Page>[] = [
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
    header: "Title",
    accessorFn: (page) => page.title,
  },
  {
    header: "Slug",
    accessorFn: (page) => page.slug,
  },
  {
    header: "Is published",
    accessorFn: (page) => (page.published ? "Published" : "Draft"),
  },
  {
    accessorFn: (page) =>
      DateTime.fromJSDate(page.publishDate).toLocaleString(
        DateTime.DATETIME_MED
      ),
    header: "Publish date",
  },
  {
    accessorFn: (page) =>
      DateTime.fromJSDate(page.createdAt).toLocaleString(DateTime.DATETIME_MED),
    header: "Created at",
  },
  {
    accessorFn: (page) =>
      DateTime.fromJSDate(page.updatedAt).toLocaleString(DateTime.DATETIME_MED),
    header: "Updated at",
  },
  {
    accessorFn: (page) => page.tags?.join(", ") || "",
    header: "Tags",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction page={row.original} />,
  },
];
