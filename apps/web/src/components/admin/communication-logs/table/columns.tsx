"use client";
import { Markdown } from "@/components/web/markdown";
import {
  CommunicationChannelTexts,
  CommunicationDirectionTexts,
  CommunicationParticipantTypeTexts,
} from "@/constants/labels";
import { ColumnDef } from "@tanstack/react-table";
import JsonView from "@uiw/react-json-view";
import { CommunicationLog } from "@vivid/types";
import {
  Button,
  Checkbox,
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  IFrame,
  Link,
  tableSortHeader,
  tableSortNoopFunction,
} from "@vivid/ui";
import { DateTime } from "luxon";

export const columns: ColumnDef<CommunicationLog>[] = [
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
    accessorFn: (log) => CommunicationDirectionTexts[log.direction],
    id: "direction",
    header: tableSortHeader("Direction", "default"),
    sortingFn: tableSortNoopFunction,
  },
  {
    accessorFn: (log) => CommunicationChannelTexts[log.channel] || log.channel,
    id: "channel",
    header: tableSortHeader("Channel", "default"),
    sortingFn: tableSortNoopFunction,
  },
  {
    accessorFn: (log) =>
      CommunicationParticipantTypeTexts[log.participantType] ||
      log.participantType,
    id: "participantType",
    header: tableSortHeader("Participant", "default"),
    sortingFn: tableSortNoopFunction,
  },
  {
    accessorFn: (log) => log.participant,
    id: "participant",
    header: tableSortHeader("Participant", "default"),
    sortingFn: tableSortNoopFunction,
  },
  {
    accessorFn: (log) => log.handledBy,
    id: "handledBy",
    header: tableSortHeader("Handler", "default"),
    sortingFn: tableSortNoopFunction,
  },
  {
    accessorFn: (log) => log.subject,
    id: "subject",
    header: tableSortHeader("Subject", "string"),
    sortingFn: tableSortNoopFunction,
  },
  {
    id: "content",
    header: tableSortHeader("Content", "string"),
    sortingFn: tableSortNoopFunction,
    cell: ({ row }) => {
      if (row.original.text.length < 50) return row.original.text;

      return (
        <div className="flex flex-col gap-1">
          <span>{row.original.text.substring(0, 50)}...</span>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="link-dashed">View more</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[80%] flex flex-col max-h-[100%]">
              <DialogHeader>
                <DialogTitle className="w-full flex flex-row justify-between items-center mt-2">
                  Log content
                </DialogTitle>
              </DialogHeader>
              <div className="flex-1 w-full overflow-auto">
                {row.original.channel === "email" && row.original.html ? (
                  <IFrame className="w-full h-[80vh]">
                    <div
                      dangerouslySetInnerHTML={{ __html: row.original.html }}
                    />
                  </IFrame>
                ) : (
                  <Markdown
                    markdown={row.original.text}
                    className="not-prose"
                  />
                )}
              </div>
              <DialogFooter className="flex-row !justify-between gap-2">
                <DialogClose asChild>
                  <Button variant="secondary">Close</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      );
    },
  },
  {
    header: "Data",
    enableSorting: false,
    cell: ({ row }) => {
      if (!row.original.data) return null;
      return (
        <div className="flex flex-col gap-1">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="link-dashed">View</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[80%] flex flex-col max-h-[100%]">
              <DialogHeader>
                <DialogTitle className="w-full flex flex-row justify-between items-center mt-2">
                  Log data
                </DialogTitle>
              </DialogHeader>
              <div className="flex-1 w-full overflow-auto">
                <JsonView value={row.original.data} />
              </div>
              <DialogFooter className="flex-row !justify-between gap-2">
                <DialogClose asChild>
                  <Button variant="secondary">Close</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      );
    },
  },
  {
    accessorFn: (log) =>
      DateTime.fromJSDate(log.dateTime).toLocaleString(DateTime.DATETIME_MED),
    id: "dateTime",
    header: tableSortHeader("Date & time", "date"),
    sortingFn: tableSortNoopFunction,
  },
  {
    id: "appointment.option.name",
    sortingFn: tableSortNoopFunction,
    header: tableSortHeader("Appointment", "string"),
    cell: ({ row }) => {
      if (!row.original.appointmentId) return null;

      return (
        <Link
          variant="default"
          href={`/admin/dashboard/appointments/${row.original.appointmentId}`}
        >
          {row.original.appointment?.option.name}
        </Link>
      );
    },
  },
  {
    id: "customer.name",
    sortingFn: tableSortNoopFunction,
    header: tableSortHeader("Customer", "string"),
    cell: ({ row }) => {
      if (!row.original.customer) return null;

      return (
        <Link
          variant="default"
          href={`/admin/dashboard/customers/${row.original.customer._id}`}
        >
          {row.original.customer.name}
        </Link>
      );
    },
  },
];

export const CommunicationLogsTableColumnsCount = columns.length;
