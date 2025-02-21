import { ServicesContainer } from "@vivid/services";
import { searchParams, searchParamsCache } from "./search-params";
import { DataTable } from "@vivid/ui";
import { columns } from "./columns";
import { CommunicationChannel } from "@vivid/types";

export type TemplatesTableProps = {
  type: CommunicationChannel;
};

export const TemplatesTable: React.FC<TemplatesTableProps> = async ({
  type,
}) => {
  const page = searchParamsCache.get("page");
  const search = searchParamsCache.get("search") || undefined;
  const limit = searchParamsCache.get("limit");
  const sort = searchParamsCache.get("sort");

  const offset = (page - 1) * limit;

  const res = await ServicesContainer.TemplatesService().getTemplates(type, {
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
