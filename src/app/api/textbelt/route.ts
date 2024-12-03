import { Services } from "@/lib/services";
import { maskify, template } from "@/lib/string";
import { sendEmail } from "@/services/notifications/email/sendEmail";
import { getArguments } from "@/services/notifications/getArguments";
import { sendSms } from "@/services/notifications/sms/sendSms";
import { Appointment } from "@/types";
import crypto from "crypto";
import { readFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import { join } from "path";

type TextbeltWebhookData = {
  textId: string;
  fromNumber: string;
  text: string;
  data?: string;
};

function verify(
  apiKey: string,
  timestamp: string,
  requestSignature: string,
  requestPayload: string
) {
  const mySignature = crypto
    .createHmac("sha256", apiKey)
    .update(timestamp + requestPayload)
    .digest("hex");

  return crypto.timingSafeEqual(
    Buffer.from(requestSignature),
    Buffer.from(mySignature)
  );
}

export async function POST(request: NextRequest, response: NextResponse) {
  const {
    sms: smsConfiguration,
    general: generalConfiguration,
    smtp: smtpConfiguration,
    booking: bookingConfiguration,
    social: socialConfiguration,
  } = await Services.ConfigurationService().getConfigurations(
    "sms",
    "smtp",
    "general",
    "booking",
    "social"
  );

  const bodyText = await request.text();
  const timestamp = request.headers.get("X-textbelt-timestamp");
  const signature = request.headers.get("X-textbelt-signature");

  if (!timestamp || !signature) {
    console.warn(`Mailformed headers in SMS webhook: ${bodyText}`);
    return NextResponse.json({ success: false }, { status: 400 });
  }

  if (!verify(smsConfiguration.authToken, timestamp, signature, bodyText)) {
    console.warn(`Unverified SMS webhook: ${bodyText}`);
    return NextResponse.json({ success: false }, { status: 401 });
  }

  const reply = JSON.parse(bodyText) as TextbeltWebhookData;
  if (!reply.fromNumber) {
    console.warn(`Mailformed body in SMS webhook: ${bodyText}`);
    return NextResponse.json({ success: false }, { status: 400 });
  }

  console.log(
    `Received TextBelt reply webhook from ${maskify(
      reply.fromNumber
    )} with data ${reply.data}`
  );

  const appointment = reply?.data
    ? await Services.EventsService().getAppointment(reply?.data)
    : undefined;

  await Services.CommunicationLogService().log({
    channel: "sms",
    direction: "inbound",
    initiator: reply.fromNumber,
    receiver: "TextBelt Webhook",
    text: reply.text,
    data: reply.textId,
    appointmentId: appointment?._id,
  });

  const bodyTemplate = await readFile(
    join(process.cwd(), "templates", "email", "ownerSmsReply.html"),
    "utf-8"
  );

  const args = getArguments(
    appointment as Appointment,
    bookingConfiguration,
    generalConfiguration,
    socialConfiguration
  );
  const arg = {
    ...args.arg,
    reply,
  };

  const description = template(bodyTemplate, arg);

  await sendEmail(
    {
      to: generalConfiguration.email,
      subject: "SMS reply",
      body: description,
    },
    smtpConfiguration,
    "TextBelt Webhook - notify owner",
    appointment?._id
  );

  if (smsConfiguration.autoReply) {
    const replyBody = template(smsConfiguration.autoReply, arg);
    await sendSms({
      phone: reply.fromNumber,
      sender: generalConfiguration.name,
      generalConfiguration,
      smsConfiguration,
      smtpConfiguration,
      body: replyBody,
      webhookData: reply.data,
      initiator: "TextBelt Webhook - auto reply",
      appointmentId: appointment?._id,
    });
  }

  return NextResponse.json({ success: true }, { status: 201 });
}
