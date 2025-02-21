import { createContext, useContext } from "react";
import { TReaderDocument } from "./core";

export const ReaderContext = createContext<TReaderDocument>({});
export const ReaderArgsContext = createContext<Record<string, any>>({});

export function useReaderDocument() {
  return useContext(ReaderContext);
}

export function useReaderArgs() {
  return useContext(ReaderArgsContext);
}
