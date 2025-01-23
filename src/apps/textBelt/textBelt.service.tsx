import {
  Appointment,
  ConnectedAppData,
  ConnectedAppStatusWithText,
  IConnectedApp,
  IConnectedAppProps,
} from "@/types";
import { TextBeltConfiguration } from "./textBelt.models";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import {
  ITextMessageSender,
  TextMessage,
  TextMessageResponse,
} from "@/types/apps/textMessage";
import { Services } from "@/lib/services";
import { maskify, template } from "@/lib/string";
import { readFile } from "fs/promises";
import { join } from "path";
import { getArguments } from "@/services/notifications/getArguments";
import { sendEmail } from "@/services/notifications/email/sendEmail";
import { sendTextMessage } from "@/services/notifications/textMessages/sendTextMessage";

const scrambleKey = (key: string) => {
  if (key.length < 6) {
    return key
      .split("")
      .map((c, i) => (i < key.length - 2 ? "*" : c))
      .join("");
  }

  if (key.length < 12) {
    return key
      .split("")
      .map((c, i) => (i >= 2 && i < key.length - 2 ? "*" : c))
      .join("");
  }

  return `${key.substring(0, 4)}...${key.substring(key.length - 4)}`;
};

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
    // @ts-ignore It's valid
    Buffer.from(requestSignature),
    Buffer.from(mySignature)
  );
}

type SmsRequest = {
  phone: string;
  message: string;
  key: string;
  sender?: string;
  replyWebhookUrl?: string;
  webhookData?: string;
};

type SmsResponse = {
  success: boolean;
  quotaRemaining: number;
  textId?: string;
  error?: string;
};

export class TextBeltConnectedApp implements IConnectedApp, ITextMessageSender {
  public constructor(protected readonly props: IConnectedAppProps) {}

  public async sendTextMessage(
    app: ConnectedAppData,
    message: TextMessage
  ): Promise<TextMessageResponse> {
    const { url } = await Services.ConfigurationService().getConfiguration(
      "general"
    );
    const request: SmsRequest = {
      message: message.message,
      key: (app.data as TextBeltConfiguration).apiKey,
      phone: message.phone,
      sender: message.sender,
      replyWebhookUrl: `${url}/api/apps/${app._id}/webhook`,
      webhookData: message.data,
    };

    try {
      const result = await fetch("https://textbelt.com/text", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
      });

      const response = (await result.json()) as SmsResponse;

      if (!response.success) {
        throw new Error(
          `Failed to send SMS: ${response.error || "unknown error"}`
        );
      }

      this.props.update({
        status: "connected",
        statusText: `Remaining quota: ${response.quotaRemaining}`,
      });

      return {
        success: response.success,
        error: response.error,
        textId: response.textId,
      };
    } catch (e: any) {
      this.props.update({
        status: "failed",
        statusText: e?.message || e?.toString() || "Something went wrong",
      });

      throw e;
    }
  }

  public async processWebhook(
    appData: ConnectedAppData,
    request: NextRequest
  ): Promise<NextResponse> {
    const config = appData.data as TextBeltConfiguration;

    const bodyText = await request.text();
    const timestamp = request.headers.get("X-textbelt-timestamp");
    const signature = request.headers.get("X-textbelt-signature");

    if (!timestamp || !signature) {
      console.warn(`Mailformed headers in SMS webhook: ${bodyText}`);
      return NextResponse.json({ success: false }, { status: 400 });
    }

    if (!verify(config?.apiKey, timestamp, signature, bodyText)) {
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

    const {
      general: generalConfiguration,
      booking: bookingConfiguration,
      social: socialConfiguration,
    } = await Services.ConfigurationService().getConfigurations(
      "general",
      "booking",
      "social"
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
      "TextBelt Webhook - notify owner",
      appointment?._id
    );

    if (config.autoReply) {
      const replyBody = template(config.autoReply, arg);
      await sendTextMessage({
        phone: reply.fromNumber,
        sender: generalConfiguration.name,
        body: replyBody,
        webhookData: reply.data,
        initiator: "TextBelt Webhook - auto reply",
        appointmentId: appointment?._id,
      });
    }

    return NextResponse.json({ success: true }, { status: 201 });
  }

  public async processRequest(
    appData: ConnectedAppData,
    data: TextBeltConfiguration
  ): Promise<ConnectedAppStatusWithText> {
    let success = false;
    let error: string | undefined = undefined;

    try {
      const response = await fetch(`https://textbelt.com/quota/${data.apiKey}`);
      if (response.status >= 400) {
        throw new Error(`Failed to fetch url. Status code: ${response.status}`);
      }

      const json = (await response.json()) as SmsResponse;

      if (!json.success || !json.quotaRemaining) {
        throw new Error(`Failed to get remaining quota or quota is zero`);
      }
      const status: ConnectedAppStatusWithText = {
        status: "connected",
        statusText: `Remaining quota is ${json.quotaRemaining}`,
      };

      this.props.update({
        account: {
          username: scrambleKey(data.apiKey),
        },
        data,
        ...status,
      });

      return status;
    } catch (e: any) {
      const status: ConnectedAppStatusWithText = {
        status: "failed",
        statusText: e?.message || e?.toString() || "Something went wrong",
      };

      this.props.update({
        ...status,
      });

      return status;
    }
  }
}
