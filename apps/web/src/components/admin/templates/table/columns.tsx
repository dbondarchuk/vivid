"use client";
import { CommunicationChannelTexts } from "@/constants/labels";
import { ColumnDef } from "@tanstack/react-table";
import { TemplateListModel } from "@vivid/types";
import {
  Checkbox,
  Link,
  tableSortHeader,
  tableSortNoopFunction,
} from "@vivid/ui";
import { DateTime } from "luxon";
import { CellAction } from "./cell-action";

export const columns: ColumnDef<TemplateListModel>[] = [
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
    accessorFn: (template) => CommunicationChannelTexts[template.type],
    id: "type",
    header: tableSortHeader("Type", "string"),
    sortingFn: tableSortNoopFunction,
  },
  {
    cell: ({ row }) => (
      <Link
        variant="underline"
        href={`/admin/dashboard/templates/${row.original._id}`}
      >
        {row.original.name}
      </Link>
    ),
    id: "name",
    header: tableSortHeader("Name", "string"),
    sortingFn: tableSortNoopFunction,
  },
  {
    accessorFn: (template) =>
      DateTime.fromJSDate(template.updatedAt).toLocaleString(
        DateTime.DATETIME_MED
      ),
    id: "updatedAt",
    header: tableSortHeader("Updated at", "date"),
    sortingFn: tableSortNoopFunction,
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction template={row.original} />,
  },
];
