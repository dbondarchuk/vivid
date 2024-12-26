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
import { tableSortHeader } from "@/components/ui/tableSortHeader";

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
    accessorFn: (log) => CommunicationDirectionTexts[log.direction],
    id: "direction",
    header: tableSortHeader("Direction", "default"),
  },
  {
    accessorFn: (log) => CommunicationChannelTexts[log.channel] || log.channel,
    id: "channel",
    header: tableSortHeader("Channel", "default"),
  },
  {
    accessorFn: (log) => log.initiator,
    id: "initiator",
    header: tableSortHeader("Initiator", "default"),
  },
  {
    accessorFn: (log) => log.receiver,
    id: "receiver",
    header: tableSortHeader("Receiver", "default"),
  },
  {
    accessorFn: (log) => log.subject,
    id: "subject",
    header: tableSortHeader("Subject", "string"),
  },
  {
    id: "text",
    header: tableSortHeader("Text", "string"),
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
    id: "dateTime",
    header: tableSortHeader("Date & time", "date"),
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
