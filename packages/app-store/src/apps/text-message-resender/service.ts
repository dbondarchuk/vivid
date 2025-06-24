import { getLoggerFactory } from "@vivid/logger";
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
  protected readonly loggerFactory = getLoggerFactory(
    "TextMessageResenderConnectedApp"
  );

  public constructor(protected readonly props: IConnectedAppProps) {}

  public async processRequest(
    appData: ConnectedAppData,
    data: TextMessageResenderConfiguration
  ): Promise<ConnectedAppStatusWithText> {
    const logger = this.loggerFactory("processRequest");
    logger.debug(
      { appId: appData._id, phone: data?.phone },
      "Processing text message resender configuration request"
    );

    try {
      const status: ConnectedAppStatusWithText = {
        status: "connected",
        statusText: "textMessageResender.statusText.successfully_set_up",
      };

      this.props.update({
        data,
        ...status,
      });

      logger.info(
        { appId: appData._id, status: status.status },
        "Successfully configured text message resender"
      );

      return status;
    } catch (error: any) {
      logger.error(
        { appId: appData._id, error },
        "Error processing text message resender configuration"
      );

      const status: ConnectedAppStatusWithText = {
        status: "failed",
        statusText:
          "textMessageResender.statusText.error_processing_configuration",
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
    const logger = this.loggerFactory("respond");
    logger.debug(
      {
        appId: appData._id,
        appointmentId: textMessageReply.data?.appointmentId,
        from: textMessageReply.from?.replace(/(\d{3})\d{3}(\d{4})/, "$1***$2"),
        message: textMessageReply.message,
        hasData: !!textMessageReply.data.data?.length,
      },
      "Processing text message resender reply"
    );

    try {
      const config = await this.props.services
        .ConfigurationService()
        .getConfigurations("booking", "general", "social");

      const { appointment, customer, ...reply } = textMessageReply;

      if (textMessageReply.data.data?.length) {
        logger.info(
          {
            appId: appData._id,
            appointmentId: reply.data.appointmentId,
            from: reply.from?.replace(/(\d{3})\d{3}(\d{4})/, "$1***$2"),
            targetPhone: textMessageReply.data.data.replace(
              /(\d{3})\d{3}(\d{4})/,
              "$1***$2"
            ),
          },
          "Processing reply from user - resending to customer"
        );

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
          handledBy: "textMessageResender.handlers.resendToCustomer",
        });

        logger.info(
          { appId: appData._id, appointmentId: reply.data.appointmentId },
          "Successfully resent user reply to customer"
        );

        return {
          handledBy: "textMessageResender.handlers.processUserReply",
          participantType: "user",
        };
      }

      logger.info(
        {
          appId: appData._id,
          appointmentId: reply.data.appointmentId,
          from: reply.from?.replace(/(\d{3})\d{3}(\d{4})/, "$1***$2"),
          customerName: customer?.name,
        },
        "Processing reply from customer - resending to user"
      );

      const body = `Hi ${config.general.name},
${customer?.name ? `${customer.name} has replied from ${reply.from}` : `You have text message from ${reply.from}`}:
${reply.message}
You can reply to this message directly`;

      const phone = appData?.data?.phone || config.general.phone;
      if (!phone) {
        logger.warn(
          { appId: appData._id, appointmentId: reply.data.appointmentId },
          "Phone field not found for owner notification"
        );

        return null;
      }

      logger.debug(
        {
          appId: appData._id,
          appointmentId: reply.data.appointmentId,
          phone: phone.replace(/(\d{3})\d{3}(\d{4})/, "$1***$2"),
          messageLength: body.length,
        },
        "Sending customer reply to user"
      );

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
        handledBy: "textMessageResender.handlers.resendToUser",
      });

      logger.info(
        { appId: appData._id, appointmentId: reply.data.appointmentId },
        "Successfully resent customer reply to user"
      );

      return {
        handledBy: "textMessageResender.handlers.processCustomerReply",
        participantType: "customer",
      };
    } catch (error: any) {
      logger.error(
        {
          appId: appData._id,
          appointmentId: textMessageReply.data?.appointmentId,
          error,
        },
        "Error processing text message resender reply"
      );

      this.props.update({
        status: "failed",
        statusText: "textMessageResender.statusText.error_processing_reply",
      });

      throw error;
    }
  }
}
