"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { Page } from "@/types";
import React from "react";
import { CellAction } from "./cell-action";
import { DateTime } from "luxon";
import { tableSortHeader } from "@/components/ui/tableSortHeader";

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
        disabled={row.original.slug === "home"}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorFn: (page) => page.title,
    id: "title",
    header: tableSortHeader("Title", "string"),
  },
  {
    accessorFn: (page) => page.slug,
    id: "slug",
    header: tableSortHeader("Slug", "string"),
  },
  {
    accessorFn: (page) => (page.published ? "Published" : "Draft"),
    id: "published",
    header: tableSortHeader("Is published", "default"),
  },
  {
    accessorFn: (page) =>
      DateTime.fromJSDate(page.publishDate).toLocaleString(
        DateTime.DATETIME_MED
      ),
    id: "publishDate",
    header: tableSortHeader("Publish date", "date"),
  },
  {
    accessorFn: (page) =>
      DateTime.fromJSDate(page.createdAt).toLocaleString(DateTime.DATETIME_MED),
    id: "createdAt",
    header: tableSortHeader("Created at", "date"),
  },
  {
    accessorFn: (page) =>
      DateTime.fromJSDate(page.updatedAt).toLocaleString(DateTime.DATETIME_MED),
    id: "updatedAt",
    header: tableSortHeader("Updated at", "date"),
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
