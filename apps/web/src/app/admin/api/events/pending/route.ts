import { getLoggerFactory } from "@vivid/logger";
import { ServicesContainer } from "@vivid/services";

export async function GET() {
  const logger = getLoggerFactory("AdminAPI/events-pending")("GET");

  logger.debug("Starting pending events SSE stream");

  const encoder = new TextEncoder();
  let id: any = null;

  const fn = async (callback: (count: number) => void) => {
    const count =
      await ServicesContainer.EventsService().getPendingAppointmentsCount(
        new Date(),
      );

    logger.debug({ count }, "Retrieved pending appointments count");
    callback(count);
    id = setTimeout(() => fn(callback), 5000);
  };

  const customReadable = new ReadableStream({
    start: async (controller) => {
      logger.debug("Initializing SSE stream");
      fn((count) =>
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(count)}\n\n`),
        ),
      );
    },
    cancel: () => {
      logger.debug("SSE stream cancelled");
      if (!!id) clearTimeout(id);
    },
  });

  return new Response(customReadable, {
    headers: {
      Connection: "keep-alive",
      "Content-Encoding": "none",
      "Cache-Control": "no-cache, no-transform",
      "Content-Type": "text/event-stream; charset=utf-8",
    },
  });
}
