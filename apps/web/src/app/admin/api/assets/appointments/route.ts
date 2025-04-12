import { ServicesContainer } from "@vivid/services";
import { UploadedFile } from "@vivid/types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
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

  return NextResponse.json(items);
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();

  const file = formData.get("file");
  const appointmentId = formData.get("appointmentId") as string;
  if (!file || !(file instanceof File) || !appointmentId) {
    return NextResponse.json(
      {
        success: false,
      },
      { status: 400 }
    );
  }

  const assets = await ServicesContainer.EventsService().addAppointmentFiles(
    appointmentId,
    [file]
  );

  if (!assets?.length) {
    return NextResponse.json(
      {
        success: false,
      },
      { status: 404 }
    );
  }

  const { url } =
    await ServicesContainer.ConfigurationService().getConfiguration("general");

  const uploadedFile: UploadedFile = {
    ...assets[0],
    url: `${request.nextUrl.origin}/assets/${assets[0].filename}`,
  };

  return NextResponse.json(uploadedFile);
}
