import {
  createSearchParamsCache,
  createSerializer,
  parseAsArrayOf,
  parseAsIsoDateTime,
  parseAsStringLiteral,
} from "nuqs/server";

import { appointmentStatuses } from "@vivid/types";
import { baseSearchParams } from "@vivid/ui";

export const searchParams = {
  ...baseSearchParams,
  start: parseAsIsoDateTime,
  end: parseAsIsoDateTime,
  status: parseAsArrayOf(parseAsStringLiteral(appointmentStatuses)).withDefault(
    ["confirmed", "pending"]
  ),
  sort: baseSearchParams.sort.withDefault([
    {
      id: "createdAt",
      desc: true,
    },
  ]),
};

export const searchParamsCache = createSearchParamsCache(searchParams);
export const serialize = createSerializer(searchParams);
