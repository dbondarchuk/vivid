import { Sort } from "@/types/database/query";
import { SearchParams } from "next/dist/server/request/search-params";

export const getSort: (searchParams: SearchParams) => Sort | undefined = (
  searchParams
) => {
  if (searchParams.sort) {
    const sortArg = Array.isArray(searchParams.sort)
      ? searchParams.sort
      : [searchParams.sort];
    return sortArg.map((x) => ({
      key: x.split(":")[0],
      desc: x.split(":")[1] === "true",
    }));
  }
};
