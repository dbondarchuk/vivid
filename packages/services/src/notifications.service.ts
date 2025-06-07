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
  constructor(
    private readonly configurationService: IConfigurationService,
    private readonly connectedAppService: IConnectedAppsService,
    private readonly communicationLogService: ICommunicationLogsService
  ) {}

  public async sendEmail({
    email,
    handledBy,
    participantType,
    appointmentId,
    customerId,
  }: EmailNotificationRequest): Promise<void> {
    const defaultAppsConfiguration =
      await this.configurationService.getConfiguration("defaultApps");

    const emailAppId = defaultAppsConfiguration?.email.appId;

    const { app, service } =
      await this.connectedAppService.getAppService<IMailSender>(emailAppId);

    console.log(
      `Sending email using app ${app.name} (ID: ${emailAppId}) to ${(Array.isArray(email.to) ? email.to : [email.to]).map((to) => maskify(to)).join("; ")} with subject ${maskify(email.subject)}.${appointmentId ? ` Appointment ID: ${appointmentId}` : ""}.${customerId ? ` Customer ID: ${customerId}` : ""}`
    );

    try {
      const response = await service.sendMail(app, email);

      console.log(
        `Successfully sent email. Response: ${JSON.stringify(response)}`
      );

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
    } catch (e) {
      console.error(e);
      throw e;
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
      console.error("No text message sender app is configured");
      throw new Error("No text message sender app is configured");
    }

    const { app, service } =
      await this.connectedAppService.getAppService<ITextMessageSender>(
        textMessageSenderAppId
      );

    console.log(
      `Sending Text Message message from ${handledBy} to ${maskify(
        trimmedPhone
      )}.${appointmentId ? ` Appointment ID: ${appointmentId}` : ""}.${customerId ? ` Customer ID: ${customerId}` : ""}`
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

      console.log(
        `Text Message sent from ${handledBy} to ${maskify(trimmedPhone)}.${
          appointmentId ? ` Appointment ID: ${appointmentId}` : ""
        }. Result: ${JSON.stringify(response)}`
      );

      this.communicationLogService.log({
        direction: "outbound",
        channel: "text-message",
        handledBy,
        participantType,
        participant: phone,
        text: body,
        appointmentId,

        data: response,
      });

      return response;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
}
