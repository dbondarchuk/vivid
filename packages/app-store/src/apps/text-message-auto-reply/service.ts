import {
  ConnectedAppData,
  ConnectedAppStatusWithText,
  IConnectedApp,
  IConnectedAppProps,
  ITextMessageResponder,
  RespondResult,
  TextMessageReply,
} from "@vivid/types";
import { getArguments, template } from "@vivid/utils";
import { TextMessageAutoReplyConfiguration } from "./models";

export default class TextMessageAutoReplyConnectedApp
  implements IConnectedApp, ITextMessageResponder
{
  public constructor(protected readonly props: IConnectedAppProps) {}

  public async processRequest(
    appData: ConnectedAppData,
    data: TextMessageAutoReplyConfiguration
  ): Promise<ConnectedAppStatusWithText> {
    try {
      const template = await this.props.services
        .TemplatesService()
        .getTemplate(data.autoReplyTemplateId);
      if (!template) {
        throw new Error("Template not found");
      }

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
    appData: ConnectedAppData<TextMessageAutoReplyConfiguration>,
    textMessageReply: TextMessageReply
  ): Promise<RespondResult | null> {
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

    if (appData.data?.autoReplyTemplateId) {
      const autoReplyTemplate = await this.props.services
        .TemplatesService()
        .getTemplate(appData.data.autoReplyTemplateId);

      if (autoReplyTemplate) {
        console.log(
          `Auto replying from Text Message Auto Reply with template ${autoReplyTemplate._id}`
        );

        const message = template(autoReplyTemplate.value, args);

        await this.props.services.NotificationService().sendTextMessage({
          body: message,
          handledBy: "Text Message Auto Reply",
          phone: reply.from,
          participantType: "customer",
          appointmentId: reply.data?.appointmentId,
          customerId: reply.data?.customerId,
          sender: config.general.name,
          webhookData: reply.data,
        });

        return {
          handledBy: "Text Message Auto Reply",
          participantType: "customer",
        };
      } else {
        this.props.update({
          status: "failed",
          statusText: "Auto reply template not found",
        });
      }
    } else {
      this.props.update({
        status: "failed",
        statusText: "Auto reply template not found",
      });
    }

    return null;
  }
}
