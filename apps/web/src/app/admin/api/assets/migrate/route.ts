import { ServicesContainer } from "@vivid/services";
import { assetsMigrateRequestSchema, IAssetsStorage } from "@vivid/types";
import { NextRequest, NextResponse } from "next/server";
import pLimit from "p-limit";

const getAtomic = () => {
  const sharedBuffer = new SharedArrayBuffer(4);
  const sharedArray = new Int32Array(sharedBuffer);
  return sharedArray;
};

export async function POST(request: NextRequest) {
  const limit = pLimit(10);

  const {
    error,
    success,
    data: body,
  } = assetsMigrateRequestSchema.safeParse(await request.json());
  if (!success || !body || error) {
    return NextResponse.json(error, { status: 400 });
  }

  const fromApp =
    await ServicesContainer.ConnectedAppsService().getAppService<IAssetsStorage>(
      body.fromAppId
    );
  const toApp =
    await ServicesContainer.ConnectedAppsService().getAppService<IAssetsStorage>(
      body.toAppId
    );

  const assets = await ServicesContainer.AssetsService().getAssets({});

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const done = getAtomic();
      const success = getAtomic();
      const error = getAtomic();
      const total = assets.total;

      try {
        const promises = assets.items.map(async (asset) => {
          try {
            console.log(`Migrate assets: Processing file ${asset.filename}`);
            // semaphore.acquire();
            const file = await fromApp.service.getFile(
              fromApp.app,
              asset.filename
            );

            await toApp.service.saveFile(
              toApp.app,
              asset.filename,
              file,
              asset.size
            );

            Atomics.add(success, 0, 1);
            console.log(
              `Migrate assets: Successfully processed file ${asset.filename}`
            );
          } catch (e) {
            Atomics.add(error, 0, 1);
            console.error(
              `Migrate assets: Failed to process file ${asset.filename}`,
              e
            );
          } finally {
            Atomics.add(done, 0, 1);
            // semaphore.release();
          }

          const chunk = encoder.encode(
            JSON.stringify({
              done: done[0],
              success: success[0],
              error: error[0],
              total,
            }) + "\n"
          );
          controller.enqueue(chunk);
        });

        await Promise.all(promises.map((p) => limit(() => p)));
      } catch (error) {
        console.error(error);
      } finally {
        controller.close();
      }
    },
  });

  return new NextResponse(stream);
}
