import { ServicesContainer } from "@vivid/services";
import { searchParams, searchParamsCache } from "./search-params";
import { DataTable } from "@vivid/ui";
import { columns } from "./columns";

export const CommunicationLogsTable: React.FC = async () => {
  const page = searchParamsCache.get("page");
  const search = searchParamsCache.get("search") || undefined;
  const limit = searchParamsCache.get("limit");
  const direction = searchParamsCache.get("direction");
  const channel = searchParamsCache.get("channel");
  const start = searchParamsCache.get("start") || undefined;
  const end = searchParamsCache.get("end") || undefined;
  const sort = searchParamsCache.get("sort");

  const offset = (page - 1) * limit;

  const res =
    await ServicesContainer.CommunicationLogService().getCommunicationLogs({
      range: { start, end },
      channel,
      direction,
      offset,
      limit,
      search,
      sort,
    });

  return (
    <DataTable
      columns={columns}
      data={res.items}
      totalItems={res.total}
      sortSchemaDefault={searchParams.sort.defaultValue}
    />
  );
};
