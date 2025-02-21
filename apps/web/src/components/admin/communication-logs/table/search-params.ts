import {
  createSearchParamsCache,
  createSerializer,
  parseAsArrayOf,
  parseAsIsoDateTime,
  parseAsStringLiteral,
} from "nuqs/server";

import {
  communicationChannels,
  communicationDirectionSchema,
} from "@vivid/types";
import { baseSearchParams } from "@vivid/ui";

export const searchParams = {
  ...baseSearchParams,
  start: parseAsIsoDateTime,
  end: parseAsIsoDateTime,
  direction: parseAsArrayOf(
    parseAsStringLiteral(communicationDirectionSchema)
  ).withDefault(["inbound", "outbound"]),
  channel: parseAsArrayOf(
    parseAsStringLiteral(communicationChannels)
  ).withDefault([...communicationChannels]),
  sort: baseSearchParams.sort.withDefault([
    {
      id: "dateTime",
      desc: true,
    },
  ]),
};

export const searchParamsCache = createSearchParamsCache(searchParams);
export const serialize = createSerializer(searchParams);
