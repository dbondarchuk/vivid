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
  webhookData,
}: {
  phone: string;
  body: string;
  generalConfiguration: GeneralConfiguration;
  smsConfiguration: SmsConfiguration;
  smtpConfiguration: SmtpConfiguration;
  sender: string;
  webhookData?: string;
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

  const result = await fetch("https://textbelt.com/text", {
    method: "post",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  const response = (await result.json()) as SmsResponse;

  if (response.quotaRemaining < 20) {
    await sendEmail(
      {
        to: generalConfiguration.email,
        subject: "Low quota amount for SMS",
        body: `You have only ${response.quotaRemaining} SMS tokens left. Please add more to be able to send SMS`,
      },
      smtpConfiguration
    );
  }

  if (response.error) {
    throw Error(response.error);
  }
};
