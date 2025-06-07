import {
  ConnectedAppData,
  ConnectedAppStatusWithText,
  IConnectedApp,
  IConnectedAppProps,
  ITextMessageResponder,
  RespondResult,
  TextMessageReply,
} from "@vivid/types";
import { TextMessageResenderConfiguration } from "./models";

export default class TextMessageResenderConnectedApp
  implements IConnectedApp, ITextMessageResponder
{
  public constructor(protected readonly props: IConnectedAppProps) {}

  public async processRequest(
    appData: ConnectedAppData,
    data: TextMessageResenderConfiguration
  ): Promise<ConnectedAppStatusWithText> {
    try {
      const status: ConnectedAppStatusWithText = {
        status: "connected",
        statusText: `App is connected`,
      };

      this.props.update({
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

  public async respond(
    appData: ConnectedAppData<TextMessageResenderConfiguration>,
    textMessageReply: TextMessageReply
  ): Promise<RespondResult | null> {
    const config = await this.props.services
      .ConfigurationService()
      .getConfigurations("booking", "general", "social");

    const { appointment, customer, ...reply } = textMessageReply;

    if (textMessageReply.data.data?.length) {
      console.log(`Processing reply from user`);

      this.props.services.NotificationService().sendTextMessage({
        phone: textMessageReply.data.data,
        body: reply.message,
        webhookData: {
          ...reply.data,
          data: undefined,
        },
        appointmentId: reply.data.appointmentId,
        customerId: reply.data.customerId,
        participantType: "customer",
        handledBy: `Text Message Responder - resend to customer`,
      });

      return {
        handledBy: "Text Message Responder - process user's reply",
        participantType: "customer",
      };
    }

    console.log(`Processing reply from customer`);

    const body = `Hi ${config.general.name},
${customer?.name ? `${customer.name} has replied from ${reply.from}` : `You have text message from ${reply.from}`}:
${reply.message}
You can reply to this message directly`;

    const phone = appData?.data?.phone || config.general.phone;
    if (!phone) {
      console.warn(`Can't find the phone field for owner notification`);

      return null;
    }

    this.props.services.NotificationService().sendTextMessage({
      phone,
      body,
      webhookData: {
        ...reply.data,
        data: reply.from,
      },
      appointmentId: reply.data.appointmentId,
      customerId: reply.data.customerId,
      participantType: "user",
      handledBy: `Text Message Responder - resend to user`,
    });

    return {
      handledBy: "Text Message Responder - process customer's reply",
      participantType: "customer",
    };
  }
}
