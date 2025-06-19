import { searchParams } from "@/components/admin/assets/table/search-params";
import { getLoggerFactory } from "@vivid/logger";
import { ServicesContainer } from "@vivid/services";
import { NextRequest, NextResponse } from "next/server";
import { createLoader } from "nuqs/server";

export async function GET(request: NextRequest) {
  const logger = getLoggerFactory("AdminAPI/assets")("GET");

  logger.debug(
    {
      url: request.url,
      method: request.method,
      searchParams: Object.fromEntries(request.nextUrl.searchParams.entries()),
    },
    "Processing assets API request"
  );

  const loader = createLoader(searchParams);
  const params = loader(request.nextUrl.searchParams);

  const page = params.page;
  const search = params.search ?? undefined;
  const limit = params.limit;
  const sort = params.sort;

  const offset = (page - 1) * limit;

  logger.debug(
    {
      page,
      search,
      limit,
      sort,
      offset,
    },
    "Fetching assets with parameters"
  );

  const res = await ServicesContainer.AssetsService().getAssets({
    offset,
    limit,
    search,
    sort,
  });

  logger.debug(
    {
      total: res.total,
      count: res.items.length,
    },
    "Successfully retrieved assets"
  );

  return NextResponse.json(res);
}

export async function POST(request: NextRequest) {
  const logger = getLoggerFactory("AdminAPI")("assets");

  logger.debug(
    {
      url: request.url,
      method: request.method,
    },
    "Processing assets upload request"
  );

  try {
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];

    logger.debug(
      {
        fileCount: files.length,
        fileNames: files.map((f) => f.name),
      },
      "Processing uploaded files"
    );

    const assets = [];
    for (const file of files) {
      const asset = await ServicesContainer.AssetsService().createAsset(
        {
          filename: file.name,
          mimeType: file.type,
        },
        file
      );
      assets.push(asset);
    }

    logger.debug(
      {
        fileCount: files.length,
        assetCount: assets.length,
      },
      "Successfully uploaded assets"
    );

    return NextResponse.json(assets);
  } catch (error: any) {
    logger.error(
      {
        error: error?.message || error?.toString(),
      },
      "Error uploading assets"
    );
    return NextResponse.json(
      { error: "Failed to upload assets" },
      { status: 500 }
    );
  }
}
