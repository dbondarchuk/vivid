import {
  ConnectedAppData,
  ConnectedAppStatusWithText,
  Email,
  EmailResponse,
  IConnectedApp,
  IConnectedAppProps,
  IMailSender,
} from "@vivid/types";
import { createEvent } from "ics";
import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import { SmtpConfiguration } from "./smtp.models";

export default class SmtpConnectedApp implements IConnectedApp, IMailSender {
  public constructor(protected readonly props: IConnectedAppProps) {}

  public async processRequest(
    appData: ConnectedAppData,
    data: SmtpConfiguration
  ): Promise<ConnectedAppStatusWithText> {
    let success = false;
    let error: string | undefined = undefined;

    try {
      const client = this.getClient(data);
      const result = await client.verify();

      if (!result) {
        throw new Error("Failed to connect");
      }

      const status: ConnectedAppStatusWithText = {
        status: "connected",
        statusText: `Successfully connected to server`,
      };

      this.props.update({
        account: {
          username: data.email,
          serverUrl: data.host,
        },
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

  public async sendMail(
    app: ConnectedAppData,
    email: Email
  ): Promise<EmailResponse> {
    try {
      const smtpConfiguration = app.data as SmtpConfiguration;

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
        attachments: email.attachments?.map((attachment) => ({
          cid: attachment.cid,
          filename: attachment.filename,
          content: attachment.content,
        })),
      };

      const client = this.getClient(smtpConfiguration);
      const response = await client.sendMail(mailOptions);

      return {
        messageId: response.messageId,
      };
    } catch (e: any) {
      const status: ConnectedAppStatusWithText = {
        status: "failed",
        statusText: e?.message || e?.toString() || "Something went wrong",
      };

      this.props.update({
        ...status,
      });

      throw e;
    }
  }

  protected getClient(smtpConfiguration: SmtpConfiguration) {
    return nodemailer.createTransport({
      host: smtpConfiguration.host,
      port: smtpConfiguration.port,
      secure: smtpConfiguration.secure,
      auth: {
        user: smtpConfiguration.auth.user,
        pass: smtpConfiguration.auth.pass,
      },
    });
  }
}
