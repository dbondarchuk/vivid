import { useQueryStates } from "nuqs";
import React from "react";
import { searchParams } from "./search-params";

import { WithTotal } from "@vivid/types";
import { DataTable, DataTableSkeleton, toast, useDebounce } from "@vivid/ui";
import { getReminders } from "../actions";
import { Reminder } from "../models";
import { columns } from "./columns";

export const RemindersTable: React.FC<{ appId: string }> = ({ appId }) => {
  const [query] = useQueryStates(searchParams);

  const delayedQuery = useDebounce(query, 100);

  const [loading, setLoading] = React.useState(true);
  const [response, setResponse] = React.useState<WithTotal<Reminder>>({
    items: [],
    total: 0,
  });

  const fn = async (query: typeof delayedQuery) => {
    setLoading(true);

    try {
      const page = query.page;
      const search = query.search || undefined;
      const limit = query.limit;
      const channel = query.channel;
      const sort = query.sort;

      const offset = (page - 1) * limit;

      const res = await getReminders(appId, {
        channel,
        offset,
        limit,
        search,
        sort,
      });

      setResponse(res);
    } catch (e: any) {
      console.error(e);
      toast.error("There was an error while loading the reminders");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fn(delayedQuery);
  }, [delayedQuery]);

  return loading ? (
    <DataTableSkeleton rowCount={10} columnCount={6} />
  ) : (
    <DataTable
      columns={columns}
      data={response.items}
      totalItems={response.total}
      sortSchemaDefault={searchParams.sort.defaultValue}
    />
  );
};
