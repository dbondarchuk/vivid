import { HeaderContext, Row, SortDirection } from "@tanstack/react-table";
import { I18nKey, I18nNamespaces, useI18n } from "@vivid/i18n";
import { icons } from "lucide-react";
import { Button } from "../button";
import { Icon } from "../icon";

export type SortingFieldType =
  | "number"
  | "string"
  | "date"
  | "time"
  | "default";
type SortingState = "false" | SortDirection;

const buttons: Record<
  SortingFieldType,
  Record<SortingState, keyof typeof icons>
> = {
  default: {
    asc: "ArrowUpWideNarrow",
    desc: "ArrowDownWideNarrow",
    false: "ArrowUpDown",
  },
  number: {
    asc: "ArrowUp01",
    desc: "ArrowDown10",
    false: "ArrowUpDown",
  },
  string: {
    asc: "ArrowUpAZ",
    desc: "ArrowDownZA",
    false: "ArrowUpDown",
  },
  date: {
    asc: "CalendarArrowUp",
    desc: "CalendarArrowDown",
    false: "ArrowUpDown",
  },
  time: {
    asc: "ClockArrowUp",
    desc: "ClockArrowDown",
    false: "ArrowUpDown",
  },
};

export const tableSortHeader = <T extends I18nNamespaces>(
  title: I18nKey<T>,
  type: SortingFieldType = "default",
  i18nNamespace: T = "ui" as T,
) => {
  const TableHeader = ({ column }: HeaderContext<any, any>) => {
    const t = useI18n(i18nNamespace);
    return (
      <Button
        variant="ghost"
        className={column.getIsSorted() ? "underline" : ""}
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        {t(title)}
        <Icon
          name={buttons[type][column.getIsSorted() || "false"]}
          className="ml-2 h-4 w-4"
        />
      </Button>
    );
  };

  return TableHeader;
};

export const tableSortNoopFunction = (
  rowA: Row<any>,
  rowB: Row<any>,
  columnId: string,
): number => {
  return rowA.index - rowB.index;
};
