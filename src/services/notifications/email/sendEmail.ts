import { Services } from "@/lib/services";
import { SmtpConfiguration } from "@/types";
import { convert } from "html-to-text";
import { createEvent, EventAttributes } from "ics";
import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";

export type IcalEventMethod = "PUBLISH" | "REQUEST" | "CANCEL" | "REPLY";

export type Email = {
  to: string | string[];
  cc?: string | string[];
  subject: string;
  body: string;
  icalEvent?: {
    method: IcalEventMethod;
    filename?: string;
    content: EventAttributes;
  };
};

export const sendEmail = async (
  email: Email,
  smtpConfiguration: SmtpConfiguration,
  initiator: string,
  appointmentId?: string
) => {
  let icalEvent: Mail.IcalAttachment | undefined = undefined;
  if (email.icalEvent) {
    const { value: icsContent, error: icsError } = createEvent(
      email.icalEvent.content
    );
    icalEvent = {
      filename: email.icalEvent.filename || "invitation.ics",
      method: email.icalEvent.method,
      content: icsContent,
    };
  }

  const mailOptions: nodemailer.SendMailOptions = {
    from: smtpConfiguration.email,
    to: email.to,
    cc: email.cc,
    subject: email.subject,
    html: email.body,
    icalEvent: icalEvent,
  };

  const transport = nodemailer.createTransport({
    host: smtpConfiguration.host,
    port: smtpConfiguration.port,
    secure: smtpConfiguration.secure,
    auth: {
      user: smtpConfiguration.auth.user,
      pass: smtpConfiguration.auth.pass,
    },
  });

  const response = await transport.sendMail(mailOptions);

  Services.CommunicationLogService().log({
    direction: "outbound",
    channel: "email",
    initiator,
    receiver: Array.isArray(email.to) ? email.to.join("; ") : email.to,
    text: convert(email.body, { wordwrap: 130 }),
    subject: email.subject,
    appointmentId,
    data: response,
  });
};
