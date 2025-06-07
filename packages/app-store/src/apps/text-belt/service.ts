import {
  ApiRequest,
  ApiResponse,
  ConnectedAppData,
  ConnectedAppStatusWithText,
  IConnectedApp,
  IConnectedAppProps,
  IConnectedAppWithWebhook,
  ITextMessageResponder,
  ITextMessageSender,
  RespondResult,
  TextMessage,
  TextMessageReply,
  TextMessageResponse,
} from "@vivid/types";
import { getArguments, maskify, template } from "@vivid/utils";
import crypto from "crypto";
import ownerTextMessageReplyTemplate from "./emails/owner-text-message-reply.html";
import { TextBeltConfiguration } from "./models";

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
  implements IConnectedApp, IConnectedAppWithWebhook, ITextMessageSender
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
        ? `${message.data.appId ?? ""}|${message.data.appointmentId ?? ""}|${message.data.customerId ?? ""}|${message.data.data ?? ""}`
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
    request: ApiRequest
  ): Promise<ApiResponse> {
    const config = appData.data as TextBeltConfiguration;

    const bodyText = await request.text();
    const timestamp = request.headers.get("X-textbelt-timestamp");
    const signature = request.headers.get("X-textbelt-signature");

    if (!timestamp || !signature) {
      console.warn(`Mailformed headers in SMS webhook: ${bodyText}`);

      return Response.json({ success: false }, { status: 400 });
    }

    if (!verify(config?.apiKey, timestamp, signature, bodyText)) {
      console.warn(`Unverified SMS webhook: ${bodyText}`);

      return Response.json({ success: false }, { status: 400 });
    }

    const reply = JSON.parse(bodyText) as TextbeltWebhookData;
    if (!reply.fromNumber) {
      console.warn(`Mailformed body in SMS webhook: ${bodyText}`);
      return Response.json({ success: false }, { status: 400 });
    }

    console.log(
      `Received TextBelt reply webhook from ${maskify(
        reply.fromNumber
      )} with data ${reply.data}`
    );

    const parts = (reply?.data || "").split("|", 4);

    const appId = parts[0] || undefined;
    const appointmentId = parts[1] || undefined;
    const customerId = parts[2] || undefined;
    const data = parts[3] || undefined;

    const appointment = appointmentId
      ? await this.props.services.EventsService().getAppointment(appointmentId)
      : null;

    const customer = customerId
      ? await this.props.services.CustomersService().getCustomer(customerId)
      : (appointment?.customer ?? null);

    const replyData: TextMessageReply = {
      from: reply.fromNumber,
      message: reply.text,
      data: {
        appId,
        data,
        appointmentId,
        customerId,
      },
      appointment,
      customer,
      messageId: reply.textId,
    };

    await this.respond(appData, replyData);

    return Response.json({ success: true }, { status: 201 });
  }

  public async processRequest(
    appData: ConnectedAppData,
    data: TextBeltConfiguration
  ): Promise<ConnectedAppStatusWithText> {
    try {
      if (data.textMessageResponderAppId) {
        const { app, service } = await this.props.services
          .ConnectedAppService()
          .getAppService<ITextMessageResponder>(data.textMessageResponderAppId);

        if (!app || !service || !service.respond) {
          throw new Error(
            `Provided app does not exist or does not support responding to text messages`
          );
        }
      }

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

  private async respond(
    appData: ConnectedAppData<TextBeltConfiguration>,
    textMessageReply: TextMessageReply
  ): Promise<void> {
    const bodyTemplate = ownerTextMessageReplyTemplate;

    const config = await this.props.services
      .ConfigurationService()
      .getConfigurations("booking", "general", "social");

    const { appointment, customer, ...reply } = textMessageReply;

    const args = getArguments({
      appointment,
      config,
      customer,
      useAppointmentTimezone: true,
      additionalProperties: {
        reply,
      },
    });

    const description = template(bodyTemplate, args);

    console.log(`Sending email to owner about incoming message.`);
    await this.props.services.NotificationService().sendEmail({
      email: {
        to: config.general.email,
        subject: "SMS reply",
        body: description,
      },
      handledBy: "TextBelt Webkook - notify owner",
      participantType: "user",
      appointmentId: appointment?._id,
      customerId: customer?._id,
    });

    let result: RespondResult | null | undefined;
    try {
      try {
        if (reply.data.appId && reply.data.appId.length) {
          const { app, service } = await this.props.services
            .ConnectedAppService()
            .getAppService<ITextMessageResponder>(reply.data.appId);

          if (!!service?.respond) {
            console.log(`Incoming message will be processed by ${app?.name}`);
          }

          result = await service?.respond?.(app, textMessageReply);
        }
      } finally {
        if (!result) {
          console.log(
            `No service has processed the incoming text message. Will try to use responder app`
          );
          if (appData.data?.textMessageResponderAppId) {
            const { app, service } = await this.props.services
              .ConnectedAppService()
              .getAppService<ITextMessageResponder>(
                appData.data.textMessageResponderAppId
              );

            result = await service.respond(app, textMessageReply);
          }
        }
      }
    } finally {
      if (!result) {
        console.log(
          `No responder app was registered with TextBelt Webhook app or it was not processed.`
        );

        result = {
          handledBy: "TextBelt Webkook",
          participantType: "customer",
        };
      }

      await this.props.services.CommunicationLogService().log({
        channel: "text-message",
        direction: "inbound",
        participant: reply.from,
        participantType: result?.participantType,
        handledBy: result.handledBy,
        text: reply.message,
        data: reply.data,
        appointmentId: appointment?._id,
        customerId: customer?._id,
      });
    }
  }
}
