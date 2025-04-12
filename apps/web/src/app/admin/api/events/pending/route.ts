import { ServicesContainer } from "@vivid/services";

export async function GET() {
  const encoder = new TextEncoder();
  let id: any = null;

  const fn = async (callback: (count: number) => void) => {
    const count =
      await ServicesContainer.EventsService().getPendingAppointmentsCount(
        new Date()
      );

    callback(count);
    id = setTimeout(() => fn(callback), 5000);
  };

  const customReadable = new ReadableStream({
    start: async (controller) => {
      fn((count) =>
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(count)}\n\n`))
      );
    },
    cancel: () => {
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
