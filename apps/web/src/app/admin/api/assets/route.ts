import { ServicesContainer } from "@vivid/services";
import { UploadedFile } from "@vivid/types";
import mimeType from "mime-type/with-db";
import { NextRequest, NextResponse } from "next/server";
import { v4 } from "uuid";

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
  const bucket = formData.get("bucket") as string;
  if (!file || !(file instanceof File)) {
    return NextResponse.json(
      {
        success: false,
      },
      { status: 400 }
    );
  }

  let fileType = mimeType.lookup(file.name);
  if (!fileType) {
    fileType = "application/octet-stream";
  } else if (Array.isArray(fileType)) {
    fileType = fileType[0];
  }

  const buffer = await file.arrayBuffer();

  const asset = await ServicesContainer.AssetsService().createAsset(
    {
      filename: `${bucket ? `${bucket}/` : ""}${v4()}-${file.name}`,
      mimeType: fileType,
      description: formData.get("description") as string,
    },
    Buffer.from(buffer)
  );

  const { url } =
    await ServicesContainer.ConfigurationService().getConfiguration("general");

  const uploadedFile: UploadedFile = {
    ...asset,
    url: `${request.nextUrl.origin}/assets/${asset.filename}`,
  };

  return NextResponse.json(uploadedFile);
}
