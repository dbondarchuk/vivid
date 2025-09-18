import { ServicesContainer } from "@vivid/services";
import { notFound } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import { Readable, ReadableOptions } from "stream";

/**
 * Return a stream from the disk
 * @param {string} path - The location of the file
 * @param {ReadableOptions} options - The streamable options for the stream (ie how big are the chunks, start, end, etc).
 * @returns {ReadableStream} A readable stream of the file
 */
function streamFile(
  downloadStream: Readable,
  options?: ReadableOptions,
): ReadableStream<Uint8Array> {
  return new ReadableStream({
    start(controller) {
      downloadStream.on("data", (chunk: Buffer | string) =>
        controller.enqueue(
          new Uint8Array(
            typeof chunk === "string" ? Buffer.from(chunk, "utf-8") : chunk,
          ),
        ),
      );
      downloadStream.on("end", () => controller.close());
      downloadStream.on("error", (error: NodeJS.ErrnoException) =>
        controller.error(error),
      );
    },
    cancel() {
      downloadStream.destroy();
    },
  });
}

type Props = {
  params: Promise<{ slug: string[] }>;
};

export async function GET(
  request: NextRequest,
  props: Props,
): Promise<NextResponse> {
  const params = await props.params;

  const filename = params.slug.join("/");

  const result = await ServicesContainer.AssetsService().streamAsset(filename);
  if (!result) {
    return notFound();
  }

  const { asset, stream } = result;

  const contentType = asset.mimeType;
  const inline = request.nextUrl.searchParams.has("inline");

  const data: ReadableStream<Uint8Array> = streamFile(stream); // Stream the file with a 1kb chunk
  const res = new NextResponse(data, {
    status: 200,
    headers: new Headers({
      //Headers
      "content-disposition": inline
        ? "inline"
        : `attachment; filename=${filename}`, //State that this is a file attachment
      "content-type": contentType,
      "content-length": `${asset.size}`,
      "Cache-Control": `public, max-age=31536000, immutable`,
    }),
  });

  return res;
}
