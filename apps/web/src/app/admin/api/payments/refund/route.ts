import { ServicesContainer } from "@vivid/services";
import { Payment, zUniqueArray } from "@vivid/types";
import { NextRequest, NextResponse } from "next/server";
import pLimit from "p-limit";
import z from "zod";

const refundPaymentsSchema = z.object({
  ids: zUniqueArray(z.array(z.string().min(1)), (s) => s),
});

export async function POST(request: NextRequest) {
  const limit = pLimit(2);

  const json = await request.json();
  const { data, success, error } = refundPaymentsSchema.safeParse(json);

  if (!success) {
    return NextResponse.json({ success: false, error }, { status: 400 });
  }

  const successes: Record<string, Payment> = {};
  const errors: Record<string, string> = {};

  try {
    const promises = data.ids.map(async (paymentId) => {
      try {
        console.log(`Refunding payment: ${paymentId}`);

        const result =
          await ServicesContainer.PaymentsService().refundPayment(paymentId);

        if (result.success) {
          successes[paymentId] = result.updatedPayment;
        } else {
          errors[paymentId] = result.error;
        }

        console.log(
          `Refunding payment ${paymentId}: ${result.success ? "success" : "error"}`
        );
      } catch (e: any) {
        console.log(`Refunding payment ${paymentId}: error: ${e}`);

        errors[paymentId] = e?.message || e?.toString();
      } finally {
      }
    });

    await Promise.all(promises.map((p) => limit(() => p)));
    return NextResponse.json(
      {
        success: Object.keys(successes).length === data.ids.length,
        updatedPayments: successes,
        errors,
      },
      { status: 201 }
    );
  } catch (e: any) {
    console.error(e);
    return NextResponse.json(
      { success: false, error: e?.message ?? e?.toString() },
      { status: 500 }
    );
  }

  // const encoder = new TextEncoder();
  // const stream = new ReadableStream({
  //   async start(controller) {
  //     const total = data.ids.length;

  //     try {
  //       const promises = data.ids.map(async (paymentId) => {
  //         try {
  //           console.log(`Refunding payment: ${paymentId}`);

  //           const result =
  //             await ServicesContainer.PaymentsService().refundPayment(
  //               paymentId
  //             );

  //           if (result.success) {
  //             successes[paymentId] = result.updatedPayment;
  //           } else {
  //             errors[paymentId] = result.error;
  //           }

  //           console.log(
  //             `Refunding payment ${paymentId}: ${success ? "success" : "error"}`
  //           );
  //         } catch (e: any) {
  //           console.log(`Refunding payment ${paymentId}: error: ${e}`);

  //           errors[paymentId] = e?.message || e?.toString();
  //         } finally {
  //         }

  //         const chunk = encoder.encode(
  //           JSON.stringify({
  //             done: Object.keys(successes).length + Object.keys(errors).length,
  //             success: Object.keys(successes).length,
  //             error: Object.keys(errors).length,
  //             total,
  //           }) + "\n---\n"
  //         );

  //         controller.enqueue(chunk);
  //       });

  //       await Promise.all(promises.map((p) => limit(() => p)));

  //       const chunk = encoder.encode(
  //         JSON.stringify({
  //           done: Object.keys(successes).length + Object.keys(errors).length,
  //           success: Object.keys(successes).length,
  //           error: Object.keys(errors).length,
  //           total,
  //           updatedPayments: successes,
  //           errors,
  //         }) + "\n---\n"
  //       );

  //       controller.enqueue(chunk);
  //     } catch (error) {
  //       console.error(error);
  //     } finally {
  //       controller.close();
  //     }
  //   },
  // });

  // return new NextResponse(stream);
}
