import { ServicesContainer } from "@vivid/services";
import { searchParams, searchParamsCache } from "./search-params";
import { DataTable } from "@vivid/ui";
import { columns } from "./columns";

export const AppointmentsTable: React.FC = async () => {
  const page = searchParamsCache.get("page");
  const search = searchParamsCache.get("search") || undefined;
  const limit = searchParamsCache.get("limit");
  const status = searchParamsCache.get("status");
  const start = searchParamsCache.get("start") || undefined;
  const end = searchParamsCache.get("end") || undefined;
  const sort = searchParamsCache.get("sort");

  const offset = (page - 1) * limit;

  const res = await ServicesContainer.EventsService().getAppointments({
    range: { start, end },
    status,
    offset,
    limit,
    search,
    sort,
  });

  const { timeZone } =
    await ServicesContainer.ConfigurationService().getConfiguration("booking");

  return (
    <DataTable
      columns={columns}
      additionalCellProps={{ timeZone }}
      data={res.items}
      totalItems={res.total}
      sortSchemaDefault={searchParams.sort.defaultValue}
    />
  );
};
