import {
  Email,
  ICommunicationLogService,
  IConfigurationService,
  IConnectedAppService,
  IMailSender,
  INotificationService,
  ITextMessageSender,
  TextMessageData,
  TextMessageResponse,
} from "@vivid/types";
import { maskify } from "@vivid/utils";
import { convert } from "html-to-text";

export class NotificationService implements INotificationService {
  constructor(
    private readonly configurationService: IConfigurationService,
    private readonly connectedAppService: IConnectedAppService,
    private readonly communicationLogService: ICommunicationLogService
  ) {}

  public async sendEmail({
    email,
    initiator,
    appointmentId,
  }: {
    email: Email;
    initiator: string;
    appointmentId?: string;
  }): Promise<void> {
    const defaultAppsConfiguration =
      await this.configurationService.getConfiguration("defaultApps");

    const emailAppId = defaultAppsConfiguration?.email.appId;

    const { app, service } =
      await this.connectedAppService.getAppService<IMailSender>(emailAppId);

    const response = await service.sendMail(app, email);

    this.communicationLogService.log({
      direction: "outbound",
      channel: "email",
      initiator,
      receiver: Array.isArray(email.to) ? email.to.join("; ") : email.to,
      text: convert(email.body, { wordwrap: 130 }),
      subject: email.subject,
      appointmentId,
      data: response,
    });
  }

  public async sendTextMessage({
    phone,
    body,
    sender,
    initiator,
    webhookData,
    appointmentId,
  }: {
    phone: string;
    body: string;
    sender?: string;
    initiator: string;
    webhookData?: TextMessageData;
    appointmentId?: string;
  }): Promise<TextMessageResponse> {
    const trimmedPhone = phone.replaceAll(/[^+0-9]/gi, "");

    const defaultAppsConfiguration =
      await this.configurationService.getConfiguration("defaultApps");
    const textMessageSenderAppId = defaultAppsConfiguration?.textMessage?.appId;
    if (!textMessageSenderAppId) {
      console.error("No text message sender app is configured");
      throw new Error("No text message sender app is configured");
    }

    const { app, service } =
      await this.connectedAppService.getAppService<ITextMessageSender>(
        textMessageSenderAppId
      );

    console.log(
      `Sending Text Message message from ${initiator} to ${maskify(
        trimmedPhone
      )}.${appointmentId ? ` Appointment ID: ${appointmentId}` : ""}`
    );

    let response: TextMessageResponse | undefined = undefined;

    try {
      response = await service.sendTextMessage(app, {
        message: body,
        phone: trimmedPhone,
        data: webhookData,
        sender,
      });

      console.log(
        `Text Message sent from ${initiator} to ${maskify(trimmedPhone)}.${
          appointmentId ? ` Appointment ID: ${appointmentId}` : ""
        }. Result: ${JSON.stringify(response)}`
      );

      if (response.error) {
        throw Error(response.error);
      }

      return response;
    } catch (e) {
      console.error(e);
      throw e;
    } finally {
      this.communicationLogService.log({
        direction: "outbound",
        channel: "text-message",
        initiator,
        receiver: phone,
        text: body,
        appointmentId,
        data: response,
      });
    }
  }
}
