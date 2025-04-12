"use client";
import { ColumnDef } from "@tanstack/react-table";
import {
  Checkbox,
  Link,
  tableSortHeader,
  tableSortNoopFunction,
} from "@vivid/ui";
import { DateTime } from "luxon";
import { reminderChannelLabels, reminderTypeLabels } from "../const";
import { Reminder } from "../models";
import { CellAction } from "./cell-action";

export const columns: ColumnDef<Reminder>[] = [
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
    cell: ({ row }) => (
      <Link
        href={`/admin/dashboard/communications/reminders/edit?id=${row.original._id}`}
      >
        {row.original.name}
      </Link>
    ),
    id: "name",
    header: tableSortHeader("Name", "string"),
    sortingFn: tableSortNoopFunction,
  },
  {
    accessorFn: (field) => reminderTypeLabels[field.type],
    id: "type",
    header: tableSortHeader("Type", "string"),
    sortingFn: tableSortNoopFunction,
  },
  {
    accessorFn: (field) => reminderChannelLabels[field.channel],
    id: "channel",
    header: tableSortHeader("Channel", "string"),
    sortingFn: tableSortNoopFunction,
  },
  {
    accessorFn: (field) =>
      DateTime.fromJSDate(field.updatedAt).toLocaleString(
        DateTime.DATETIME_MED
      ),
    id: "updatedAt",
    header: tableSortHeader("Updated at", "date"),
    sortingFn: tableSortNoopFunction,
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <CellAction reminder={row.original} appId={row.original.appId} />
    ),
  },
];
