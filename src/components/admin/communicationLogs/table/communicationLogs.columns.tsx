"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import {
  CommunicationChannel,
  CommunicationDirection,
  CommunicationLog,
} from "@/types";
import { DateTime } from "luxon";
import React from "react";
import ReactJson from "react-json-view";
import { Link } from "@/components/ui/link";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Markdown } from "@/components/web/markdown/Markdown";

export const CommunicationDirectionTexts: Record<
  CommunicationDirection,
  string
> = {
  inbound: "Inbound",
  outbound: "Outbound",
};

export const CommunicationChannelTexts: Record<CommunicationChannel, string> = {
  sms: "SMS",
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
    header: "Direction",
    accessorFn: (log) => CommunicationDirectionTexts[log.direction],
  },
  {
    header: "Channel",
    accessorFn: (log) => CommunicationChannelTexts[log.channel] || log.channel,
  },
  {
    accessorFn: (log) => log.initiator,
    header: "Initiator",
  },
  {
    accessorFn: (log) => log.receiver,
    header: "Receiver",
  },
  {
    accessorFn: (log) => log.subject,
    header: "Subject",
  },
  {
    header: "Text",
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
                <ReactJson src={row.original.data} />
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
    header: "Date & time",
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
