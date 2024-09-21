"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { Appointment } from "@/types";
import { DateTime } from "luxon";
import {
  CalendarCheck,
  CalendarClock,
  CalendarX,
  LucideProps,
} from "lucide-react";
import React from "react";
import { StatusText } from "../types";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Link } from "@/components/ui/link";
import { AppointmentDialog } from "../appointment.dialog";
import { Button } from "@/components/ui/button";

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

const OptionCell: React.FC<{ appointment: Appointment }> = ({
  appointment,
}) => {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  return (
    <>
      {isDialogOpen && (
        <AppointmentDialog
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
          <TooltipContent className="flex flex-col w-full py-2 px-4">
            <div className="grid grid-cols-2 gap-1 pb-2 border-b">
              <div>Option name:</div>
              <div>{appointment.option.name}</div>
              {appointment.option.price && (
                <>
                  <div>Option price:</div>
                  <div>${appointment.option.price}</div>
                </>
              )}
              {appointment.option.duration && (
                <>
                  <div>Option duration:</div>
                  <div>{appointment.option.duration} min</div>
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
              {appointment.totalDuration && (
                <>
                  <div className="font-medium">Duration:</div>
                  <div>{appointment.totalDuration} min</div>
                </>
              )}

              {appointment.totalPrice && (
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

export const columns: ColumnDef<Appointment>[] = [
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
    header: "Status",
    cell: ({ row }) => <StatusCell appointment={row.original} size={20} />,
  },
  {
    header: "Option",
    cell: ({ row }) => <OptionCell appointment={row.original} />,
  },
  {
    accessorFn: (app) => app.fields.name,
    header: "Customer",
  },
  {
    accessorFn: (app) => app.fields.email,
    header: "Email",
  },
  {
    accessorFn: (app) =>
      DateTime.fromJSDate(app.dateTime).toLocaleString(DateTime.DATETIME_MED),
    header: "Date & time",
  },
  {
    header: "Duration",
    cell: ({ row }) => <span>{row.original.totalDuration} min</span>,
  },
];
