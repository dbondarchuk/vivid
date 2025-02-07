import {
  ConnectedAppData,
  ConnectedAppStatusWithText,
  IConnectedApp,
  IConnectedAppProps,
  ITextMessageResponder,
  ITextMessageSender,
  TextMessage,
  TextMessageResponse,
} from "@vivid/types";
import { maskify } from "@vivid/utils";
import crypto from "crypto";
import { NextApiRequest, NextApiResponse } from "next";
import { TextBeltConfiguration } from "./textBelt.models";

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

export default class TextBeltConnectedApp
  implements IConnectedApp, ITextMessageSender
{
  public constructor(protected readonly props: IConnectedAppProps) {}

  public async sendTextMessage(
    app: ConnectedAppData,
    message: TextMessage
  ): Promise<TextMessageResponse> {
    const { url } = await this.props.services
      .ConfigurationService()
      .getConfiguration("general");
    const request: SmsRequest = {
      message: message.message,
      key: (app.data as TextBeltConfiguration).apiKey,
      phone: message.phone,
      sender: message.sender,
      replyWebhookUrl: `${url}/api/apps/${app._id}/webhook`,
      webhookData: message.data
        ? `${message.data.appId}|${message.data.data}`
        : undefined,
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
        data: {
          quotaRemaining: response.quotaRemaining,
        },
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
    request: NextApiRequest,
    result: NextApiResponse
  ): Promise<void> {
    const config = appData.data as TextBeltConfiguration;

    const bodyText = await request.body();
    const timestamp = request.headers["X-textbelt-timestamp"] as string;
    const signature = request.headers["X-textbelt-signature"] as string;

    if (!timestamp || !signature) {
      console.warn(`Mailformed headers in SMS webhook: ${bodyText}`);
      result.status(400).json({ success: false });

      return;
    }

    if (!verify(config?.apiKey, timestamp, signature, bodyText)) {
      console.warn(`Unverified SMS webhook: ${bodyText}`);
      result.status(401).json({ success: false });

      return;
    }

    const reply = JSON.parse(bodyText) as TextbeltWebhookData;
    if (!reply.fromNumber) {
      console.warn(`Mailformed body in SMS webhook: ${bodyText}`);
      result.status(400).json({ success: false });

      return;
    }

    console.log(
      `Received TextBelt reply webhook from ${maskify(
        reply.fromNumber
      )} with data ${reply.data}`
    );

    const [appId, data] = (reply?.data || "").split("|", 2);

    const appointment = data
      ? await this.props.services.EventsService().getAppointment(data)
      : undefined;

    await this.props.services.CommunicationLogService().log({
      channel: "text-message",
      direction: "inbound",
      initiator: reply.fromNumber,
      receiver: "TextBelt Webhook",
      text: reply.text,
      data: reply.textId,
      appointmentId: appointment?._id,
    });

    if (appId && appId.length) {
      const { app, service } = await this.props.services
        .ConnectedAppService()
        .getAppService<ITextMessageResponder>(appId);

      service?.respond?.(app, data, {
        from: reply.fromNumber,
        message: reply.text,
        data: {
          appId,
          data,
        },
      });
    }

    result.status(201).json({ success: true });
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
