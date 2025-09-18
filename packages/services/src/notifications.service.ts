import { getLoggerFactory } from "@vivid/logger";
import {
  EmailNotificationRequest,
  ICommunicationLogsService,
  IConfigurationService,
  IConnectedAppsService,
  IMailSender,
  INotificationService,
  ITextMessageSender,
  TextMessageNotificationRequest,
  TextMessageResponse,
} from "@vivid/types";
import { maskify } from "@vivid/utils";
import { convert } from "html-to-text";

export class NotificationService implements INotificationService {
  protected readonly loggerFactory = getLoggerFactory("NotificationService");

  constructor(
    private readonly configurationService: IConfigurationService,
    private readonly connectedAppService: IConnectedAppsService,
    private readonly communicationLogService: ICommunicationLogsService,
  ) {}

  public async sendEmail({
    email,
    handledBy,
    participantType,
    appointmentId,
    customerId,
  }: EmailNotificationRequest): Promise<void> {
    const logger = this.loggerFactory("sendEmail");
    const defaultAppsConfiguration =
      await this.configurationService.getConfiguration("defaultApps");

    const emailAppId = defaultAppsConfiguration?.email.appId;

    const { app, service } =
      await this.connectedAppService.getAppService<IMailSender>(emailAppId);

    logger.info(
      {
        emailAppName: app.name,
        emailAppId,
        emailTo: (Array.isArray(email.to) ? email.to : [email.to])
          .map((to) => maskify(to))
          .join("; "),
        emailSubject: email.subject,
        appointmentId,
        customerId,
      },
      "Sending email",
    );

    try {
      const response = await service.sendMail(app, email);

      logger.info({ response }, "Successfully sent email");

      this.communicationLogService.log({
        direction: "outbound",
        channel: "email",
        handledBy,
        participantType,
        participant: Array.isArray(email.to) ? email.to.join("; ") : email.to,
        text: convert(email.body, { wordwrap: 130 }),
        html: email.body,
        subject: email.subject,
        appointmentId,
        customerId,
        data: response,
      });
    } catch (error) {
      logger.error({ error }, "Error sending email");
      throw error;
    }
  }

  public async sendTextMessage({
    phone,
    body,
    sender,
    handledBy,
    participantType,
    webhookData,
    appointmentId,
    customerId,
  }: TextMessageNotificationRequest): Promise<TextMessageResponse> {
    const trimmedPhone = phone.replaceAll(/[^+0-9]/gi, "");

    const defaultAppsConfiguration =
      await this.configurationService.getConfiguration("defaultApps");
    const textMessageSenderAppId = defaultAppsConfiguration?.textMessage?.appId;

    if (!textMessageSenderAppId) {
      const logger = this.loggerFactory("sendTextMessage");
      logger.error("No text message sender app is configured");
      throw new Error("No text message sender app is configured");
    }

    const { app, service } =
      await this.connectedAppService.getAppService<ITextMessageSender>(
        textMessageSenderAppId,
      );

    const logger = this.loggerFactory("sendTextMessage");
    logger.info(
      {
        textMessageSenderAppName: app.name,
        textMessageSenderAppId,
        textMessageSenderParticipant: handledBy,
        textMessageSenderPhone: maskify(trimmedPhone),
        appointmentId,
        customerId,
      },
      "Sending Text Message message",
    );

    let response: TextMessageResponse | undefined = undefined;

    try {
      response = await service.sendTextMessage(app, {
        message: body,
        phone: trimmedPhone,
        data: webhookData,
        sender,
      });

      if (response.error) {
        throw Error(response.error);
      }

      logger.info(
        {
          textMessageSenderAppName: app.name,
          textMessageSenderAppId,
          textMessageSenderParticipant: handledBy,
          textMessageSenderPhone: maskify(trimmedPhone),
          appointmentId,
          customerId,
        },
        "Text Message sent",
      );

      this.communicationLogService.log({
        direction: "outbound",
        channel: "text-message",
        handledBy,
        participantType,
        participant: phone,
        text: body,
        appointmentId,
        customerId,
        data: response,
      });

      return response;
    } catch (error) {
      logger.error({ error }, "Error sending Text Message");
      throw error;
    }
  }
}
