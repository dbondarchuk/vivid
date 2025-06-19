"use client";
import { ColumnDef } from "@tanstack/react-table";
import {
  Checkbox,
  Link,
  tableSortHeader,
  tableSortNoopFunction,
} from "@vivid/ui";
import { DateTime } from "luxon";
import { followUpChannelLabels, followUpTypeLabels } from "../const";
import { FollowUp } from "../models";
import { CellAction } from "./cell-action";

export const columns: ColumnDef<FollowUp>[] = [
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
        href={`/admin/dashboard/communications/follow-ups/edit?id=${row.original._id}`}
        variant="underline"
      >
        {row.original.name}
      </Link>
    ),
    id: "name",
    header: tableSortHeader("Name", "string"),
    sortingFn: tableSortNoopFunction,
  },
  {
    accessorFn: (field) => followUpTypeLabels[field.type],
    id: "type",
    header: tableSortHeader("Type", "string"),
    sortingFn: tableSortNoopFunction,
  },
  {
    accessorFn: (field) => followUpChannelLabels[field.channel],
    id: "channel",
    header: tableSortHeader("Channel", "string"),
    sortingFn: tableSortNoopFunction,
  },
  {
    accessorFn: (field) => field.afterAppointmentCount || "All",
    id: "afterAppointmentCount",
    header: tableSortHeader("After appointment count", "number"),
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
      <CellAction followUp={row.original} appId={row.original.appId} />
    ),
  },
];
