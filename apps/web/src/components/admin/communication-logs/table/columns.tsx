"use client";
import { Markdown } from "@/components/web/markdown";
import { ColumnDef } from "@tanstack/react-table";
import JsonView from "@uiw/react-json-view";
import {
  CommunicationChannel,
  CommunicationDirection,
  CommunicationLog,
} from "@vivid/types";
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
  Link,
  tableSortHeader,
  tableSortNoopFunction,
} from "@vivid/ui";
import { DateTime } from "luxon";

export const CommunicationDirectionTexts: Record<
  CommunicationDirection,
  string
> = {
  inbound: "Inbound",
  outbound: "Outbound",
};

export const CommunicationChannelTexts: Record<CommunicationChannel, string> = {
  "text-message": "Text Message",
  email: "Email",
} as any;

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
    accessorFn: (log) => log.initiator,
    id: "initiator",
    header: tableSortHeader("Initiator", "default"),
    sortingFn: tableSortNoopFunction,
  },
  {
    accessorFn: (log) => log.receiver,
    id: "receiver",
    header: tableSortHeader("Receiver", "default"),
    sortingFn: tableSortNoopFunction,
  },
  {
    accessorFn: (log) => log.subject,
    id: "subject",
    header: tableSortHeader("Subject", "string"),
    sortingFn: tableSortNoopFunction,
  },
  {
    id: "text",
    header: tableSortHeader("Text", "string"),
    sortingFn: tableSortNoopFunction,
    cell: ({ row }) => {
      if (row.original.text.length < 50) return row.original.text;

      return (
        <div className="flex flex-col gap-1">
          <span>{row.original.text.substring(0, 50)}...</span>
          <Dialog>
            <DialogTrigger>
              <Button variant="default">View more</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[80%] flex flex-col max-h-[100%]">
              <DialogHeader>
                <DialogTitle className="w-full flex flex-row justify-between items-center mt-2">
                  Log text
                </DialogTitle>
              </DialogHeader>
              <div className="flex-1 w-full overflow-auto">
                <Markdown markdown={row.original.text} className="not-prose" />
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
            <DialogTrigger>
              <Button variant="default">View</Button>
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
    header: "Appointment",
    cell: ({ row }) => {
      if (!row.original.appointmentId) return null;

      return (
        <Link
          variant="default"
          href={`/admin/dashboard/appointments/${row.original.appointmentId}`}
        >
          View
        </Link>
      );
    },
  },
];
