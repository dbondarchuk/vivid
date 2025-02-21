import {
  createSearchParamsCache,
  createSerializer,
  parseAsArrayOf,
  parseAsBoolean,
} from "nuqs/server";

import { baseSearchParams } from "@vivid/ui";

export const searchParams = {
  ...baseSearchParams,
  published: parseAsArrayOf(parseAsBoolean).withDefault([true, false]),
  sort: baseSearchParams.sort.withDefault([
    {
      id: "updatedAt",
      desc: true,
    },
  ]),
};

export const searchParamsCache = createSearchParamsCache(searchParams);
export const serialize = createSerializer(searchParams);
