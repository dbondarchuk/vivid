import { getLoggerFactory } from "@vivid/logger";
import { ServicesContainer } from "@vivid/services";
import { UploadedFile } from "@vivid/types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const logger = getLoggerFactory("AdminAPI/assets-appointments")("GET");

  logger.debug(
    {
      url: request.url,
      method: request.method,
      searchParams: Object.fromEntries(request.nextUrl.searchParams.entries()),
    },
    "Processing assets appointments API request"
  );

  const searchParams = request.nextUrl.searchParams;
  const accept = searchParams.getAll("accept");
  const search = searchParams.get("search");

  const response = await ServicesContainer.AssetsService().getAssets({
    search: search || undefined,
    accept,
  });

  const items = response.items.map(
    (asset) =>
      ({
        ...asset,
        url: `${request.nextUrl.origin}/assets/${asset.filename}`,
      }) satisfies UploadedFile
  );

  logger.debug(
    {
      total: response.total,
      count: response.items.length,
    },
    "Successfully retrieved assets"
  );

  return NextResponse.json(items);
}

export async function POST(request: NextRequest) {
  const logger = getLoggerFactory("AdminAPI")("assets-appointments");

  logger.debug(
    {
      url: request.url,
      method: request.method,
    },
    "Processing assets appointments upload request"
  );

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const appointmentId = formData.get("appointmentId") as string;

    if (!file || !appointmentId) {
      logger.warn(
        { hasFile: !!file, hasAppointmentId: !!appointmentId },
        "Missing required file or appointmentId"
      );
      return NextResponse.json(
        { error: "File and appointment ID are required" },
        { status: 400 }
      );
    }

    logger.debug(
      {
        fileName: file.name,
        fileSize: file.size,
        appointmentId,
      },
      "Uploading asset for appointment"
    );

    const assets = await ServicesContainer.EventsService().addAppointmentFiles(
      appointmentId,
      [file]
    );

    if (!assets?.length) {
      logger.warn(
        {
          appointmentId,
          total: 0,
          count: 0,
        },
        "No assets uploaded for appointment"
      );
      return NextResponse.json(
        {
          success: false,
        },
        { status: 404 }
      );
    }

    // const { url } =
    //   await ServicesContainer.ConfigurationService().getConfiguration("general");

    const uploadedFile: UploadedFile = {
      ...assets[0],
      url: `${request.nextUrl.origin}/assets/${assets[0].filename}`,
    };

    logger.debug(
      {
        assetId: assets[0]._id,
        fileName: assets[0].filename,
        appointmentId,
      },
      "Successfully uploaded asset for appointment"
    );

    return NextResponse.json(uploadedFile);
  } catch (error: any) {
    logger.error(
      {
        error: error?.message || error?.toString(),
      },
      "Error uploading asset for appointment"
    );
    return NextResponse.json(
      { error: "Failed to upload asset" },
      { status: 500 }
    );
  }
}
