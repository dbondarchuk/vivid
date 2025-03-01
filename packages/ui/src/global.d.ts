import "@tanstack/react-table";

declare module "@tanstack/react-table" {
  interface ColumnMeta {
    dontGrow?: boolean;
    widthPercentage?: number;
  }
}
