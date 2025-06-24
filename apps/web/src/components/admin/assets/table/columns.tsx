"use client";
import { ColumnDef } from "@tanstack/react-table";
import { useI18n } from "@vivid/i18n";
import { Asset } from "@vivid/types";
import {
  AssetPreview,
  Checkbox,
  Link,
  tableSortHeader,
  tableSortNoopFunction,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@vivid/ui";
import { humanFileSize } from "@vivid/utils";
import { DateTime } from "luxon";
import { CellAction } from "./cell-action";

const shortenFilename = (filename: string, maxLength = 20): string => {
  const dotIndex = filename.lastIndexOf(".");
  if (dotIndex <= 0 || filename.length <= maxLength) return filename;

  const name = filename.slice(0, dotIndex);
  const ext = filename.slice(dotIndex);
  const availableLength = maxLength - ext.length;

  if (availableLength <= 3) {
    // Not enough room for ellipsis and meaningful name parts
    return filename.slice(0, maxLength);
  }

  const charsToShow = availableLength - 1; // 1 for ellipsis
  const frontChars = Math.ceil(charsToShow / 2);
  const backChars = Math.floor(charsToShow / 2);

  const shortName = name.slice(0, frontChars) + "…" + name.slice(-backChars);
  return shortName + ext;
};

export const columns: ColumnDef<Asset>[] = [
  {
    id: "select",
    header: ({ table }) => {
      const t = useI18n("admin");
      return (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label={t("assets.table.actions.selectAll")}
        />
      );
    },
    cell: ({ row }) => {
      const t = useI18n("admin");
      return (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label={t("assets.table.actions.selectRow")}
        />
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "preview",
    header: () => {
      const t = useI18n("admin");
      return t("assets.table.columns.preview");
    },
    enableSorting: false,
    cell: ({ row }) => <AssetPreview asset={row.original} />,
    accessorFn: () => "",
  },
  {
    id: "filename",
    cell: ({ row }) => (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="text-primary underline decoration-dashed underline-offset-2">
              {shortenFilename(
                row.original.filename?.substring(
                  row.original.filename.lastIndexOf("/") + 1
                )
              )}
            </span>
          </TooltipTrigger>
          <TooltipContent>{row.original.filename}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
    header: tableSortHeader("assets.table.columns.fileName", "string", "admin"),
    accessorFn: (asset) => asset.filename,
    sortingFn: tableSortNoopFunction,
  },
  {
    id: "mimeType",
    header: tableSortHeader("assets.table.columns.fileType", "string", "admin"),
    accessorFn: (asset) => asset.mimeType,
    sortingFn: tableSortNoopFunction,
  },
  {
    id: "size",
    header: tableSortHeader("assets.table.columns.fileSize", "number", "admin"),
    accessorFn: (asset) => humanFileSize(asset.size),
    sortingFn: tableSortNoopFunction,
  },
  {
    accessorFn: (asset) => asset.description || "",
    id: "description",
    header: tableSortHeader(
      "assets.table.columns.description",
      "string",
      "admin"
    ),
    sortingFn: tableSortNoopFunction,
  },
  {
    cell: ({ row }) =>
      row.original.appointment ? (
        <Link
          href={`/admin/dashboard/appointments/${row.original.appointmentId}`}
          variant="underline"
        >
          {row.original.appointment.option.name}
        </Link>
      ) : null,
    id: "appointment.option.name",
    header: tableSortHeader(
      "assets.table.columns.appointment",
      "string",
      "admin"
    ),
    sortingFn: tableSortNoopFunction,
  },
  {
    cell: ({ row }) =>
      row.original.customer ? (
        <Link
          href={`/admin/dashboard/customers/${row.original.customer?._id}`}
          variant="underline"
        >
          {row.original.customer.name}
        </Link>
      ) : null,
    id: "customer.name",
    header: tableSortHeader("assets.table.columns.customer", "string", "admin"),
    sortingFn: tableSortNoopFunction,
  },
  {
    accessorFn: (asset) =>
      DateTime.fromJSDate(asset.uploadedAt).toLocaleString(
        DateTime.DATETIME_MED
      ),
    id: "uploadedAt",
    header: tableSortHeader("assets.table.columns.uploadTime", "date", "admin"),
    sortingFn: tableSortNoopFunction,
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction asset={row.original} />,
  },
];

export const AssetsTableColumnsCount = columns.length;
