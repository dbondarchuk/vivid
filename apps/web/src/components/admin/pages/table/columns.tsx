"use client";
import { ColumnDef } from "@tanstack/react-table";
import { useI18n } from "@vivid/i18n";
import { Page } from "@vivid/types";
import { Checkbox, tableSortHeader, tableSortNoopFunction } from "@vivid/ui";
import { DateTime } from "luxon";
import { CellAction } from "./cell-action";

export const columns: ColumnDef<Page>[] = [
  {
    id: "select",
    header: ({ table }) => {
      const t = useI18n("admin");
      return (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label={t("pages.table.actions.selectAll")}
        />
      );
    },
    cell: ({ row }) => {
      const t = useI18n("admin");
      return (
        <Checkbox
          checked={row.getIsSelected()}
          disabled={row.original.slug === "home"}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label={t("pages.table.actions.selectRow")}
        />
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorFn: (page) => page.title,
    id: "title",
    header: tableSortHeader("pages.table.columns.title", "string", "admin"),
    sortingFn: tableSortNoopFunction,
  },
  {
    accessorFn: (page) => page.slug,
    id: "slug",
    header: tableSortHeader("pages.table.columns.slug", "string", "admin"),
    sortingFn: tableSortNoopFunction,
  },
  {
    accessorFn: (page) => (page.published ? "Published" : "Draft"),
    id: "published",
    header: tableSortHeader(
      "pages.table.columns.published",
      "default",
      "admin"
    ),
    sortingFn: tableSortNoopFunction,
  },
  {
    accessorFn: (page) =>
      DateTime.fromJSDate(page.publishDate).toLocaleString(
        DateTime.DATETIME_MED
      ),
    id: "publishDate",
    header: tableSortHeader("pages.table.columns.publishDate", "date", "admin"),
    sortingFn: tableSortNoopFunction,
  },
  {
    accessorFn: (page) =>
      DateTime.fromJSDate(page.createdAt).toLocaleString(DateTime.DATETIME_MED),
    id: "createdAt",
    header: tableSortHeader("pages.table.columns.createdAt", "date", "admin"),
    sortingFn: tableSortNoopFunction,
  },
  {
    accessorFn: (page) =>
      DateTime.fromJSDate(page.updatedAt).toLocaleString(DateTime.DATETIME_MED),
    id: "updatedAt",
    header: tableSortHeader("pages.table.columns.updatedAt", "date", "admin"),
    sortingFn: tableSortNoopFunction,
  },
  {
    header: ({ column }) => {
      const t = useI18n("admin");
      return t("pages.table.columns.tags");
    },
    id: "tags",
    sortingFn: tableSortNoopFunction,
    cell: ({ row }) => {
      return row.original.tags?.join(", ") || "";
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction page={row.original} />,
  },
];

export const PagesTableColumnsCount = columns.length;
