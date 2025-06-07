"use client";
import { CellContext, ColumnDef, RowData } from "@tanstack/react-table";
import { Appointment, StatusText } from "@vivid/types";
import {
  Button,
  Link,
  tableSortHeader,
  tableSortNoopFunction,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@vivid/ui";
import { durationToTime } from "@vivid/utils";
import {
  CalendarCheck,
  CalendarClock,
  CalendarX,
  LucideProps,
} from "lucide-react";
import { DateTime } from "luxon";
import React from "react";
import { AppointmentDialog } from "../appointment-dialog";

const StatusCell: React.FC<{ appointment: Appointment } & LucideProps> = ({
  appointment,
  ...rest
}) => {
  let child: React.ReactNode;
  switch (appointment.status) {
    case "confirmed":
      child = <CalendarCheck {...rest} />;
      break;

    case "declined":
      child = <CalendarX {...rest} />;
      break;

    case "pending":
    default:
      child = <CalendarClock {...rest} />;
      break;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger
          className="flex justify-center w-full"
          type="button"
          aria-label={`Status: ${StatusText[appointment.status]}`}
        >
          {child}
        </TooltipTrigger>
        <TooltipContent>{StatusText[appointment.status]}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const OptionCell: React.FC<{
  appointment: Appointment;
  timeZone?: string;
}> = ({ appointment, timeZone }) => {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  return (
    <>
      {isDialogOpen && (
        <AppointmentDialog
          timeZone={timeZone}
          defaultOpen={isDialogOpen}
          onOpenChange={(open) => !open && setIsDialogOpen(false)}
          appointment={appointment}
        />
      )}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="link"
              className="font-normal underline decoration-dashed"
              // href={`/admin/dashboard/appointments/${appointment._id}`}
              onClick={() => setIsDialogOpen(true)}
            >
              {appointment.option.name}
            </Button>
          </TooltipTrigger>
          <TooltipContent className="flex flex-col gap-2 w-full py-2 px-4">
            <div className="grid grid-cols-2 gap-1 pb-2 border-b">
              <div>Option name:</div>
              <div>{appointment.option.name}</div>
              {(appointment.option.price ?? 0) > 0 && (
                <>
                  <div>Option price:</div>
                  <div>${appointment.option.price}</div>
                </>
              )}
              {appointment.option.duration &&
                appointment.option.duration > 0 && (
                  <>
                    <div>Option duration:</div>
                    <div>
                      {durationToTime(appointment.option.duration).hours} hr{" "}
                      {durationToTime(appointment.option.duration).minutes} min
                    </div>
                  </>
                )}
              {appointment.addons && appointment.addons.length > 0 && (
                <>
                  <div>Selected addons:</div>
                  <ul>
                    {appointment.addons.map((addon, index) => (
                      <li key={index}>
                        {addon.name}
                        {(addon.price || addon.duration) && (
                          <ul className="pl-2">
                            {addon.duration && (
                              <li>Duration: {addon.duration} min</li>
                            )}
                            {addon.price && <li>Price: ${addon.price}</li>}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                </>
              )}
              {appointment.note && (
                <>
                  <div>Note:</div>
                  <div>{appointment.note}</div>
                </>
              )}
            </div>
            <div className="grid grid-cols-2 gap-1">
              {(appointment.totalDuration ?? 0) > 0 && (
                <>
                  <div className="font-medium">Duration:</div>
                  <div>
                    {durationToTime(appointment.totalDuration).hours} hr{" "}
                    {durationToTime(appointment.totalDuration).minutes} min
                  </div>
                </>
              )}

              {(appointment.totalPrice ?? 0) > 0 && (
                <>
                  <div className="font-medium">Price:</div>
                  <div>${appointment.totalPrice}</div>
                </>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </>
  );
};

const CustomerCell: React.FC<{
  appointment: Appointment;
}> = ({ appointment }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            variant="link"
            className="font-normal"
            href={`/admin/dashboard/customers/${appointment.customerId}`}
          >
            {appointment.customer.name}
          </Link>
        </TooltipTrigger>
        <TooltipContent className="flex flex-col gap-2 w-full py-2 px-4">
          <div className="grid grid-cols-2 gap-1">
            <div>Name:</div>
            <div>{appointment.customer.name}</div>
            <div>Email:</div>
            <div>{appointment.customer.email}</div>
            <div>Phone:</div>
            <div>{appointment.customer.phone}</div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

type TimezoneCellContext<TData extends RowData, TValue = unknown> = CellContext<
  TData,
  TValue
> & {
  timeZone?: string;
};

export const columns: ColumnDef<Appointment>[] = [
  // {
  //   id: "select",
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={table.getIsAllPageRowsSelected()}
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label="Select all"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label="Select row"
  //     />
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  {
    cell: ({ row }) => <StatusCell appointment={row.original} size={20} />,
    id: "status",
    header: tableSortHeader("Status", "default"),
    sortingFn: tableSortNoopFunction,
    enableResizing: false,
    meta: {
      dontGrow: true,
    },
  },
  {
    cell: ({ row, timeZone }: TimezoneCellContext<Appointment>) => (
      <OptionCell appointment={row.original} timeZone={timeZone} />
    ),
    id: "option.name",
    header: tableSortHeader("Option", "string"),
    sortingFn: tableSortNoopFunction,
  },
  {
    cell: ({ row }) => <CustomerCell appointment={row.original} />,
    id: "customer.name",
    header: tableSortHeader("Customer", "string"),
    sortingFn: tableSortNoopFunction,
  },
  {
    cell: ({ row, timeZone }: TimezoneCellContext<Appointment>) =>
      DateTime.fromJSDate(row.original.dateTime)
        .setZone(timeZone)
        .toLocaleString(DateTime.DATETIME_MED),
    id: "dateTime",
    header: tableSortHeader("Date & time", "date"),
    sortingFn: tableSortNoopFunction,
  },
  {
    cell: ({ row, timeZone }: TimezoneCellContext<Appointment>) =>
      DateTime.fromJSDate(row.original.createdAt)
        .setZone(timeZone)
        .toLocaleString(DateTime.DATETIME_MED),
    id: "createdAt",
    header: tableSortHeader("Requested at", "date"),
    sortingFn: tableSortNoopFunction,
  },
  {
    cell: ({ row }) => {
      const { hours, minutes } = durationToTime(row.original.totalDuration);

      return (
        <span>
          {hours > 0 && <>{hours} hr</>}
          {hours > 0 && minutes > 0 && <> </>}
          {minutes > 0 && <>{minutes} min</>}
        </span>
      );
    },
    id: "totalDuration",
    header: tableSortHeader("Duration at", "time"),
    sortingFn: tableSortNoopFunction,
  },
  {
    accessorFn: (app) => (app.totalPrice ? `$${app.totalPrice}` : null),
    id: "totalPrice",
    header: tableSortHeader("Price", "number"),
    sortingFn: tableSortNoopFunction,
  },
];

export const AppointmentsTableColumnsCount = columns.length;
