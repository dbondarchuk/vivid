import { Services } from "@/lib/services";
import { maskify } from "@/lib/string";
import {
  Appointment,
  BookingConfiguration,
  GeneralConfiguration,
  SmsConfiguration,
  SmtpConfiguration,
} from "@/types";
import { sendEmail } from "../email/sendEmail";

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

export const sendSms = async ({
  phone,
  body,
  generalConfiguration,
  smsConfiguration,
  smtpConfiguration,
  sender,
  initiator,
  webhookData,
  appointmentId,
}: {
  phone: string;
  body: string;
  generalConfiguration: GeneralConfiguration;
  smsConfiguration: SmsConfiguration;
  smtpConfiguration: SmtpConfiguration;
  sender: string;
  initiator: string;
  webhookData?: string;
  appointmentId?: string;
}) => {
  const trimmedPhone = phone.replaceAll(/[^+0-9]/gi, "");

  const request: SmsRequest = {
    message: body,
    key: smsConfiguration.authToken,
    phone: trimmedPhone,
    sender,
    replyWebhookUrl: `${generalConfiguration.url}/api/textbelt`,
    webhookData,
  };

  console.log(
    `Sending SMS message from ${initiator} to ${maskify(trimmedPhone)}.${
      appointmentId ? ` Appointment ID: ${appointmentId}` : ""
    }`
  );

  let response: SmsResponse | undefined = undefined;

  try {
    const result = await fetch("https://textbelt.com/text", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });

    response = (await result.json()) as SmsResponse;

    if (response.quotaRemaining < 20) {
      await sendEmail(
        {
          to: generalConfiguration.email,
          subject: "Low quota amount for SMS",
          body: `You have only ${response.quotaRemaining} SMS tokens left. Please add more to be able to send SMS`,
        },
        smtpConfiguration,
        "sendSMS - Low Quota"
      );
    }

    console.log(
      `SMS sent from ${initiator} to ${maskify(trimmedPhone)}.${
        appointmentId ? ` Appointment ID: ${appointmentId}` : ""
      }. Result: ${JSON.stringify(response)}`
    );

    if (response.error) {
      throw Error(response.error);
    }

    return response;
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
