"use client";
import { useI18n } from "@vivid/i18n";
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
    header: ({ table }) => {
      const t = useI18n("ui");
      return (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label={t("common.selectAll")}
        />
      );
    },
    cell: ({ row }) => {
      const t = useI18n("ui");
      return (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label={t("common.selectRow")}
        />
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    cell: ({ row }) => (
      <Link
        href={`/admin/dashboard/communications/reminders/edit?id=${row.original._id}`}
        variant="underline"
      >
        {row.original.name}
      </Link>
    ),
    id: "name",
    header: tableSortHeader("reminders.table.columns.name", "string", "apps"),
    sortingFn: tableSortNoopFunction,
  },
  {
    cell: ({ row }) => {
      const t = useI18n("apps");
      return t(reminderTypeLabels[row.original.type]);
    },
    id: "type",
    header: tableSortHeader("reminders.table.columns.type", "string", "apps"),
    sortingFn: tableSortNoopFunction,
  },
  {
    cell: ({ row }) => {
      const t = useI18n("apps");
      return t(reminderChannelLabels[row.original.channel]);
    },
    id: "channel",
    header: tableSortHeader(
      "reminders.table.columns.channel",
      "string",
      "apps"
    ),
    sortingFn: tableSortNoopFunction,
  },
  {
    accessorFn: (field) =>
      DateTime.fromJSDate(field.updatedAt).toLocaleString(
        DateTime.DATETIME_MED
      ),
    id: "updatedAt",
    header: tableSortHeader(
      "reminders.table.columns.updatedAt",
      "date",
      "apps"
    ),
    sortingFn: tableSortNoopFunction,
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <CellAction reminder={row.original} appId={row.original.appId} />
    ),
  },
];
