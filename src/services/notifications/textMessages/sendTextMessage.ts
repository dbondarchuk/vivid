import { Services } from "@/lib/services";
import { maskify } from "@/lib/string";
import { Appointment, BookingConfiguration } from "@/types";
import {
  ITextMessageSender,
  TextMessageResponse,
} from "@/types/apps/textMessage";

export const getPhoneField = (
  appointment: Appointment,
  config: BookingConfiguration
): string | undefined => {
  const fields = new Set(
    ["phone", ...(config.textMessages.phoneField || [])].map((x) =>
      x.toLowerCase()
    )
  );

  const [_, phone] =
    Object.entries(appointment.fields as Record<string, string>).find(
      ([field]) => fields.has(field.toLowerCase())
    ) || [];

  if (!phone) {
    return;
  }

  return phone;
};

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
  sender: string;
  initiator: string;
  webhookData?: string;
  appointmentId?: string;
}) => {
  const trimmedPhone = phone.replaceAll(/[^+0-9]/gi, "");

  const communicationsConfig =
    await Services.ConfigurationService().getConfiguration("communications");
  const textMessageSenderAppId = communicationsConfig?.textMessage?.appId;
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
      channel: "sms",
      initiator,
      receiver: phone,
      text: body,
      appointmentId,
      data: response,
    });
  }
};
