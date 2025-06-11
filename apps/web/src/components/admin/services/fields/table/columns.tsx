"use client";
import { ColumnDef } from "@tanstack/react-table";
import { IdName, ServiceField } from "@vivid/types";
import {
  Button,
  Checkbox,
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
  Link,
  ScrollArea,
  Table,
  tableSortHeader,
  tableSortNoopFunction,
} from "@vivid/ui";
import { DateTime } from "luxon";
import { CellAction } from "./cell-action";
import { FieldTypeLabels } from "@/constants/labels";

export const columns: ColumnDef<
  ServiceField & {
    addons?: IdName[];
    options?: IdName[];
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
        href={`/admin/dashboard/services/fields/${row.original._id}`}
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
    accessorFn: (field) => FieldTypeLabels[field.type],
    id: "type",
    header: tableSortHeader("Type", "string"),
    sortingFn: tableSortNoopFunction,
  },
  {
    accessorFn: (field) => field.data.label,
    id: "label",
    header: tableSortHeader("Label", "string"),
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
    cell: ({ row }) =>
      row.original.addons?.length ? (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="link-dashed">{row.original.addons.length}</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>{row.original.data.label} in addons</DialogTitle>
            <ScrollArea className="max-h-64">
              <ul>
                {row.original.addons.map((addon) => (
                  <li key={addon._id}>
                    <Link
                      href={`/admin/dashboard/services/addons/${addon._id}`}
                      variant="underline"
                    >
                      {addon.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </ScrollArea>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Close
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ) : (
        <Button variant="link" disabled>
          0
        </Button>
      ),
    id: "addons",
    header: tableSortHeader("Addons", "number"),
  },
  {
    cell: ({ row }) =>
      row.original.options?.length ? (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="link-dashed">{row.original.options.length}</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>{row.original.data.label} in options</DialogTitle>
            <ScrollArea className="max-h-64">
              <ul>
                {row.original.options.map((option) => (
                  <li key={option._id}>
                    <Link
                      href={`/admin/dashboard/services/options/${option._id}`}
                      variant="underline"
                    >
                      {option.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </ScrollArea>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Close
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ) : (
        <Button variant="link" disabled>
          0
        </Button>
      ),
    id: "options",
    header: tableSortHeader("Options", "number"),
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction field={row.original} />,
  },
];
