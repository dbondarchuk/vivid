type Props = {
  params: Promise<{ file: string }>;
};

import { createCanvas } from "canvas";
import { notFound } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

const generatePlaceholderImage = ({
  width,
  height,
  r = 128,
  g = 128,
  b = 128,
  text,
  format = "png",
}: {
  width: number;
  height: number;
  r?: number;
  g?: number;
  b?: number;
  text: string;
  format?: "png" | "jpg";
}) => {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
  ctx.fillRect(0, 0, width, height);

  ctx.font = "20px Arial";
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text || `${width}x${height}`, width / 2, height / 2);

  const bufferFormat = format === "jpg" ? "image/jpeg" : "image/png";
  // @ts-expect-error passing down the correct format
  const buffer = canvas.toBuffer(bufferFormat) as Buffer;

  return buffer;
};

export async function GET(
  request: NextRequest,
  props: Props
): Promise<NextResponse> {
  const { file } = await props.params;

  const lastDotIndex = file.lastIndexOf(".");
  const filename = file.substring(0, lastDotIndex).toLowerCase().split("x", 2);
  const ext = file.substring(lastDotIndex + 1);

  const width = parseInt(filename[0]);
  const height = parseInt(filename[1]);

  if (!width || !height || !["jpg", "png"].includes(ext)) {
    return notFound();
  }

  const result = generatePlaceholderImage({
    width,
    height,
    format: ext as any,
    text: `${width}X${height}`,
  });

  if (!result) {
    return notFound();
  }

  const contentType = `image/${ext}`;
  const inline = request.nextUrl.searchParams.has("inline");

  const res = new NextResponse(result, {
    status: 200,
    headers: new Headers({
      //Headers
      "content-disposition": inline ? "inline" : `attachment; filename=${file}`, //State that this is a file attachment
      "content-type": contentType,
      "content-length": `${result.length}`,
    }),
  });

  return res;
}
