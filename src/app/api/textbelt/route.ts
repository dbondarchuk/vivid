import { Services } from "@/lib/services";
import { template } from "@/lib/string";
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
  const smsConfiguration =
    await Services.ConfigurationService().getConfiguration("sms");
  const smtpConfiguration =
    await Services.ConfigurationService().getConfiguration("smtp");
  const generalConfiguration =
    await Services.ConfigurationService().getConfiguration("general");
  const bookingConfiguration =
    await Services.ConfigurationService().getConfiguration("booking");
  const socialConfiguration =
    await Services.ConfigurationService().getConfiguration("social");

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
    `Received TextBelt reply webhook from ${reply.fromNumber} with data ${reply.data}`
  );

  const appointment = reply?.data
    ? await Services.EventsService().getAppointment(reply?.data)
    : undefined;

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
    smtpConfiguration
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
    });
  }

  return NextResponse.json({ success: true }, { status: 201 });
}
