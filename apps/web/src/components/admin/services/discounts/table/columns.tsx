"use client";
import { DiscountTypeLabels } from "@/constants/labels";
import { ColumnDef } from "@tanstack/react-table";
import { Discount } from "@vivid/types";
import {
  Checkbox,
  Link,
  tableSortHeader,
  tableSortNoopFunction,
} from "@vivid/ui";
import { DateTime } from "luxon";
import { CellAction } from "./cell-action";

export const columns: ColumnDef<
  Discount & {
    usedCount: number;
  }
>[] = [
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
        href={`/admin/dashboard/services/discounts/${row.original._id}`}
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
    accessorFn: (discount) => discount.codes?.join(", "),
    id: "codes",
    header: "Codes",
    sortingFn: tableSortNoopFunction,
  },
  {
    accessorFn: (discount) => DiscountTypeLabels[discount.type],
    id: "type",
    header: tableSortHeader("Type", "string"),
    sortingFn: tableSortNoopFunction,
  },
  {
    accessorFn: (discount) =>
      discount.type === "amount" ? `$${discount.value}` : `${discount.value}%`,
    id: "value",
    header: tableSortHeader("Value", "string"),
    sortingFn: tableSortNoopFunction,
  },
  {
    accessorFn: (discount) => (discount.enabled ? "Active" : "Disabled"),
    id: "enabled",
    header: tableSortHeader("Status", "default"),
    sortingFn: tableSortNoopFunction,
  },
  {
    accessorFn: (discount) =>
      discount.startDate
        ? DateTime.fromJSDate(discount.startDate).toLocaleString(
            DateTime.DATETIME_MED
          )
        : "",
    id: "startDate",
    header: tableSortHeader("From", "date"),
    sortingFn: tableSortNoopFunction,
  },
  {
    accessorFn: (discount) =>
      discount.endDate
        ? DateTime.fromJSDate(discount.endDate).toLocaleString(
            DateTime.DATETIME_MED
          )
        : "",
    id: "endDate",
    header: tableSortHeader("To", "date"),
    sortingFn: tableSortNoopFunction,
  },
  {
    cell: ({ row }) => (
      <Link
        href={`/admin/dashboard/appointments?discount=${row.original._id}`}
        variant="underline"
      >
        {row.original.usedCount || 0}
      </Link>
    ),
    id: "usedCount",
    header: tableSortHeader("Total usage", "number"),
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
    cell: ({ row }) => <CellAction discount={row.original} />,
  },
];

export const DiscountsTableColumnsCount = columns.length;
