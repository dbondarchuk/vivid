"use client";
import { ColumnDef } from "@tanstack/react-table";
import {
  Checkbox,
  Link,
  tableSortHeader,
  tableSortNoopFunction,
} from "@vivid/ui";
import { DateTime } from "luxon";
import { FollowUp } from "../models";
import { CellAction } from "./cell-action";
import { useI18n, useLocale } from "@vivid/i18n";

export const columns: ColumnDef<FollowUp>[] = [
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
        href={`/admin/dashboard/communications/follow-ups/edit?id=${row.original._id}`}
        variant="underline"
      >
        {row.original.name}
      </Link>
    ),
    id: "name",
    header: tableSortHeader("followUps.table.columns.name", "string", "apps"),
    sortingFn: tableSortNoopFunction,
  },
  {
    cell: ({ row }) => {
      const t = useI18n("apps");
      return t(`followUps.triggers.${row.original.type}`);
    },
    id: "type",
    header: tableSortHeader("followUps.table.columns.type", "string", "apps"),
    sortingFn: tableSortNoopFunction,
  },
  {
    cell: ({ row }) => {
      const t = useI18n("apps");
      return t(`followUps.channels.${row.original.channel}`);
    },
    id: "channel",
    header: tableSortHeader(
      "followUps.table.columns.channel",
      "string",
      "apps"
    ),
    sortingFn: tableSortNoopFunction,
  },
  {
    cell: ({ row }) => {
      const t = useI18n("apps");
      return row.original.afterAppointmentCount || t("followUps.table.all");
    },
    id: "afterAppointmentCount",
    header: tableSortHeader(
      "followUps.table.columns.afterAppointmentCount",
      "number",
      "apps"
    ),
    sortingFn: tableSortNoopFunction,
  },
  {
    cell: ({ row }) => {
      const locale = useLocale();
      return DateTime.fromJSDate(row.original.updatedAt).toLocaleString(
        DateTime.DATETIME_MED,
        { locale }
      );
    },
    id: "updatedAt",
    header: tableSortHeader(
      "followUps.table.columns.updatedAt",
      "date",
      "apps"
    ),
    sortingFn: tableSortNoopFunction,
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <CellAction followUp={row.original} appId={row.original.appId} />
    ),
  },
];
