"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Page } from "@vivid/types";
import { Checkbox, tableSortHeader, tableSortNoopFunction } from "@vivid/ui";
import { DateTime } from "luxon";
import { CellAction } from "./cell-action";

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
    sortingFn: tableSortNoopFunction,
  },
  {
    accessorFn: (page) => page.slug,
    id: "slug",
    header: tableSortHeader("Slug", "string"),
    sortingFn: tableSortNoopFunction,
  },
  {
    accessorFn: (page) => (page.published ? "Published" : "Draft"),
    id: "published",
    header: tableSortHeader("Is published", "default"),
    sortingFn: tableSortNoopFunction,
  },
  {
    accessorFn: (page) =>
      DateTime.fromJSDate(page.publishDate).toLocaleString(
        DateTime.DATETIME_MED
      ),
    id: "publishDate",
    header: tableSortHeader("Publish date", "date"),
    sortingFn: tableSortNoopFunction,
  },
  {
    accessorFn: (page) =>
      DateTime.fromJSDate(page.createdAt).toLocaleString(DateTime.DATETIME_MED),
    id: "createdAt",
    header: tableSortHeader("Created at", "date"),
    sortingFn: tableSortNoopFunction,
  },
  {
    accessorFn: (page) =>
      DateTime.fromJSDate(page.updatedAt).toLocaleString(DateTime.DATETIME_MED),
    id: "updatedAt",
    header: tableSortHeader("Updated at", "date"),
    sortingFn: tableSortNoopFunction,
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
