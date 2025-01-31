import { Services } from "@/lib/services";
import { maskify } from "@/lib/string";
import {
  ITextMessageSender,
  TextMessageData,
  TextMessageResponse,
} from "@/types/apps/textMessage";

export const sendTextMessage = async ({
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
}) => {
  const trimmedPhone = phone.replaceAll(/[^+0-9]/gi, "");

  const defaultAppsConfiguration =
    await Services.ConfigurationService().getConfiguration("defaultApps");
  const textMessageSenderAppId = defaultAppsConfiguration?.textMessage?.appId;
  if (!textMessageSenderAppId) {
    console.error("No text message sender app is configured");
    return;
  }

  const { app, service } = await Services.ConnectedAppService().getAppService(
    textMessageSenderAppId
  );

  console.log(
    `Sending Text Message message from ${initiator} to ${maskify(
      trimmedPhone
    )}.${appointmentId ? ` Appointment ID: ${appointmentId}` : ""}`
  );

  let response: TextMessageResponse | undefined = undefined;

  try {
    response = await (service as any as ITextMessageSender).sendTextMessage(
      app,
      {
        message: body,
        phone: trimmedPhone,
        data: webhookData,
        sender,
      }
    );

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
  } finally {
    Services.CommunicationLogService().log({
      direction: "outbound",
      channel: "text-message",
      initiator,
      receiver: phone,
      text: body,
      appointmentId,
      data: response,
    });
  }
};
