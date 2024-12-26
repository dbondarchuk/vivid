import { HeaderContext, SortDirection } from "@tanstack/react-table";
import { Button } from "./button";
import { icons } from "lucide-react";
import { Icon } from "./icon";

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

export const tableSortHeader = (
  title: string,
  type: SortingFieldType = "default"
) => {
  const TableHeader = ({ column }: HeaderContext<any, any>) => {
    return (
      <Button
        variant="ghost"
        className={column.getIsSorted() ? "underline" : ""}
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        {title}
        <Icon
          name={buttons[type][column.getIsSorted() || "false"]}
          className="ml-2 h-4 w-4"
        />
      </Button>
    );
  };

  return TableHeader;
};
