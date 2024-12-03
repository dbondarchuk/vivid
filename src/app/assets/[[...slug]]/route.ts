import { createReadStream, existsSync } from "fs";
import fs from "fs/promises";
import { mimeType } from "mime-type/with-db";
import { notFound } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { ReadableOptions } from "stream";

/**
 * Return a stream from the disk
 * @param {string} path - The location of the file
 * @param {ReadableOptions} options - The streamable options for the stream (ie how big are the chunks, start, end, etc).
 * @returns {ReadableStream} A readable stream of the file
 */
function streamFile(
  path: string,
  options?: ReadableOptions
): ReadableStream<Uint8Array> {
  const downloadStream = createReadStream(path, options);

  return new ReadableStream({
    start(controller) {
      downloadStream.on("data", (chunk: Buffer) =>
        controller.enqueue(new Uint8Array(chunk))
      );
      downloadStream.on("end", () => controller.close());
      downloadStream.on("error", (error: NodeJS.ErrnoException) =>
        controller.error(error)
      );
    },
    cancel() {
      downloadStream.destroy();
    },
  });
}

type Props = {
  params: { slug: string[] };
};

export async function GET(
  request: NextRequest,
  { params }: Props
): Promise<NextResponse> {
  const file = path.join(process.cwd(), "public", "upload", ...params.slug);

  if (!existsSync(file)) {
    console.warn(`File ${params.slug} not found`);
    return notFound();
  }

  const filename = path.basename(file);
  const contentType = (mimeType.contentType(filename) as string) || "";
  const inline = request.nextUrl.searchParams.has("inline");

  const stats = await fs.stat(file); // Get the file size
  const data: ReadableStream<Uint8Array> = streamFile(file); // Stream the file with a 1kb chunk
  const res = new NextResponse(data, {
    status: 200,
    headers: new Headers({
      //Headers
      "content-disposition": inline
        ? "inline"
        : `attachment; filename=${filename}`, //State that this is a file attachment
      "content-type": contentType,
      "content-length": stats.size + "",
    }),
  });

  return res;
}
