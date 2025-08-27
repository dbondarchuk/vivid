"use client";
import { ColumnDef } from "@tanstack/react-table";
import { useI18n, useLocale } from "@vivid/i18n";
import { Appointment } from "@vivid/types";
import {
  Button,
  Link,
  tableSortHeader,
  tableSortNoopFunction,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  useTimeZone,
} from "@vivid/ui";
import { durationToTime, formatAmountString } from "@vivid/utils";
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
  const t = useI18n("admin");
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
          aria-label={t("appointments.table.columns.statusAriaLabel", {
            status: t(`appointments.status.${appointment.status}`),
          })}
        >
          {child}
        </TooltipTrigger>
        <TooltipContent>
          {t(`appointments.status.${appointment.status}`)}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const OptionCell: React.FC<{
  appointment: Appointment;
}> = ({ appointment }) => {
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
      <Button
        variant="link-dashed"
        // href={`/admin/dashboard/appointments/${appointment._id}`}
        onClick={() => setIsDialogOpen(true)}
      >
        {appointment.option.name}
      </Button>
      {/* <TooltipProvider>
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
              <div>{t("appointments.table.columns.optionName")}:</div>
              <div>{appointment.option.name}</div>
              {(appointment.option.price ?? 0) > 0 && (
                <>
                  <div>{t("appointments.table.columns.optionPrice")}:</div>
                  <div>${appointment.option.price}</div>
                </>
              )}
              {appointment.option.duration &&
                appointment.option.duration > 0 && (
                  <>
                    <div>{t("appointments.table.columns.optionDuration")}:</div>
                    <div>
                      {durationToTime(appointment.option.duration).hours} hr{" "}
                      {durationToTime(appointment.option.duration).minutes} min
                    </div>
                  </>
                )}
              {appointment.addons && appointment.addons.length > 0 && (
                <>
                  <div>{t("appointments.table.columns.selectedAddons")}:</div>
                  <ul>
                    {appointment.addons.map((addon, index) => (
                      <li key={index}>
                        {addon.name}
                        {(addon.price || addon.duration) && (
                          <ul className="pl-2">
                            {addon.duration && (
                              <li>{t("appointments.table.columns.duration")}: {addon.duration} min</li>
                            )}
                            {addon.price && <li>{t("appointments.table.columns.price")}: ${addon.price}</li>}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                </>
              )}
              {appointment.note && (
                <>
                  <div>{t("appointments.table.columns.note")}:</div>
                  <div>{appointment.note}</div>
                </>
              )}
            </div>
            <div className="grid grid-cols-2 gap-1">
              {(appointment.totalDuration ?? 0) > 0 && (
                <>
                  <div className="font-medium">{t("appointments.table.columns.duration")}:</div>
                  <div>
                    {durationToTime(appointment.totalDuration).hours} hr{" "}
                    {durationToTime(appointment.totalDuration).minutes} min
                  </div>
                </>
              )}

              {(appointment.totalPrice ?? 0) > 0 && (
                <>
                  <div className="font-medium">{t("appointments.table.columns.price")}:</div>
                  <div>${appointment.totalPrice}</div>
                </>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider> */}
    </>
  );
};

const CustomerCell: React.FC<{
  appointment: Appointment;
}> = ({ appointment }) => {
  const t = useI18n("admin");
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={`/admin/dashboard/customers/${appointment.customerId}`}
            variant="underline"
          >
            {appointment.customer.name}
          </Link>
        </TooltipTrigger>
        <TooltipContent className="flex flex-col gap-2 w-full py-2 px-4">
          <div className="grid grid-cols-2 gap-1">
            <div>{t("appointments.table.columns.customerName")}:</div>
            <div>{appointment.customer.name}</div>
            <div>{t("appointments.table.columns.customerEmail")}:</div>
            <div>{appointment.customer.email}</div>
            <div>{t("appointments.table.columns.customerPhone")}:</div>
            <div>{appointment.customer.phone}</div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

// type TimezoneCellContext<TData extends RowData, TValue = unknown> = CellContext<
//   TData,
//   TValue
// > & {
// };

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
    header: tableSortHeader(
      "appointments.table.columns.status",
      "default",
      "admin",
    ),
    sortingFn: tableSortNoopFunction,
    enableResizing: false,
    meta: {
      dontGrow: true,
    },
  },
  {
    cell: ({ row }) => <OptionCell appointment={row.original} />,
    id: "option.name",
    header: tableSortHeader(
      "appointments.table.columns.option",
      "string",
      "admin",
    ),
    sortingFn: tableSortNoopFunction,
  },
  {
    cell: ({ row }) => <CustomerCell appointment={row.original} />,
    id: "customer.name",
    header: tableSortHeader(
      "appointments.table.columns.customer",
      "string",
      "admin",
    ),
    sortingFn: tableSortNoopFunction,
  },
  {
    cell: ({ row }) => {
      const timeZone = useTimeZone();
      const locale = useLocale();
      return DateTime.fromJSDate(row.original.dateTime)
        .setZone(timeZone)
        .toLocaleString(DateTime.DATETIME_MED, { locale });
    },
    id: "dateTime",
    header: tableSortHeader(
      "appointments.table.columns.dateTime",
      "date",
      "admin",
    ),
    sortingFn: tableSortNoopFunction,
  },
  {
    cell: ({ row }) => {
      const timeZone = useTimeZone();
      const locale = useLocale();
      return DateTime.fromJSDate(row.original.createdAt)
        .setZone(timeZone)
        .toLocaleString(DateTime.DATETIME_MED, { locale });
    },
    id: "createdAt",
    header: tableSortHeader(
      "appointments.table.columns.requestedAt",
      "date",
      "admin",
    ),
    sortingFn: tableSortNoopFunction,
  },
  {
    cell: ({ row }) => {
      const time = durationToTime(row.original.totalDuration);
      const t = useI18n("admin");

      return <span>{t("common.timeDuration", time)}</span>;
    },
    id: "totalDuration",
    header: tableSortHeader(
      "appointments.table.columns.duration",
      "time",
      "admin",
    ),
    sortingFn: tableSortNoopFunction,
  },
  {
    cell: ({ row }) =>
      row.original.discount ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                variant="underline"
                href={`/admin/dashboard/services/discounts/${row.original.discount.id}`}
              >
                {row.original.discount.code}{" "}
                <span className="text-sm">
                  -${formatAmountString(row.original.discount.discountAmount)}
                </span>
              </Link>
            </TooltipTrigger>
            <TooltipContent>{row.original.discount.name}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : null,
    id: "discount.name",
    header: tableSortHeader(
      "appointments.table.columns.discount",
      "time",
      "admin",
    ),
    sortingFn: tableSortNoopFunction,
  },
  {
    accessorFn: (appointment) =>
      appointment.totalPrice
        ? `$${formatAmountString(appointment.totalPrice)}`
        : null,
    id: "totalPrice",
    header: tableSortHeader(
      "appointments.table.columns.price",
      "number",
      "admin",
    ),
    sortingFn: tableSortNoopFunction,
  },
];

export const AppointmentsTableColumnsCount = columns.length;
