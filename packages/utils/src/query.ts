import { Leaves } from "@vivid/types";

export const buildSearchQuery = <T extends {}>(
  filter: any,
  ...fields: Leaves<T>[]
) => {
  const result = [];
  for (const field of fields) {
    result.push({
      [field]: filter,
    });
  }

  return result;
};
