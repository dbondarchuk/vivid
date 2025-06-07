"use client";
import { ColumnDef } from "@tanstack/react-table";
import {
  AppointmentEntity,
  AppointmentOption,
  CustomerListModel,
} from "@vivid/types";
import {
  Checkbox,
  Link,
  tableSortHeader,
  tableSortNoopFunction,
} from "@vivid/ui";
import { DateTime } from "luxon";
import { CellAction } from "./cell-action";
import Image from "next/image";
import React from "react";

const AppointmentCell: React.FC<{ appointment?: AppointmentEntity }> = ({
  appointment,
}) =>
  appointment && appointment.option ? (
    <Link href={`/admin/dashboard/appointments/${appointment._id}`}>
      {appointment.option.name} at{" "}
      {DateTime.fromJSDate(appointment.dateTime).toLocaleString(
        DateTime.DATETIME_MED
      )}
    </Link>
  ) : (
    ""
  );

export const columns: ColumnDef<CustomerListModel>[] = [
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
      <Image
        alt={row.original.name}
        src={row.original.avatar ?? "/unknown-person.png"}
        width={50}
        height={50}
      />
    ),
    id: "avatar",
    header: "",
    sortingFn: tableSortNoopFunction,
  },
  {
    cell: ({ row }) => (
      <Link href={`/admin/dashboard/customers/${row.original._id}`}>
        {row.original.name}
      </Link>
    ),
    id: "name",
    header: tableSortHeader("Name", "string"),
    sortingFn: tableSortNoopFunction,
  },
  {
    cell: ({ row }) => (
      <Link href={`/admin/dashboard/customers/${row.original._id}`}>
        {row.original.email}
      </Link>
    ),
    id: "email",
    header: tableSortHeader("Email", "string"),
    sortingFn: tableSortNoopFunction,
  },
  {
    cell: ({ row }) => (
      <Link href={`/admin/dashboard/customers/${row.original._id}`}>
        {row.original.phone}
      </Link>
    ),
    id: "phone",
    header: tableSortHeader("Phone", "string"),
    sortingFn: tableSortNoopFunction,
  },
  {
    cell: ({ row }) => (
      <AppointmentCell appointment={row.original.lastAppointment} />
    ),
    id: "lastAppointment.dateTime",
    header: tableSortHeader("Last appointment", "date"),
    sortingFn: tableSortNoopFunction,
  },
  {
    cell: ({ row }) => (
      <AppointmentCell appointment={row.original.nextAppointment} />
    ),
    id: "nextAppointment.dateTime",
    header: tableSortHeader("Next appointment", "date"),
    sortingFn: tableSortNoopFunction,
  },
  {
    accessorFn: (customer) => customer.appointmentsCount,
    id: "appointmentsCount",
    header: tableSortHeader("Total appointments", "number"),
    sortingFn: tableSortNoopFunction,
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction customer={row.original} />,
  },
];

export const CustomersTableColumnLength = columns.length;
