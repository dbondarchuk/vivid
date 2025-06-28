import { getLoggerFactory } from "@vivid/logger";
import {
  ConnectedAppData,
  ConnectedAppError,
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
import { SmtpConfiguration } from "./models";

export default class SmtpConnectedApp implements IConnectedApp, IMailSender {
  protected readonly loggerFactory = getLoggerFactory("SmtpConnectedApp");

  public constructor(protected readonly props: IConnectedAppProps) {}

  public async processRequest(
    appData: ConnectedAppData,
    data: SmtpConfiguration
  ): Promise<ConnectedAppStatusWithText> {
    const logger = this.loggerFactory("processRequest");
    logger.debug(
      {
        appId: appData._id,
        host: data.host,
        port: data.port,
        secure: data.secure,
        email: data.email,
      },
      "Processing SMTP configuration request"
    );

    try {
      const client = this.getClient(data);

      logger.debug(
        { appId: appData._id, host: data.host, port: data.port },
        "Verifying SMTP connection"
      );

      const result = await client.verify();

      if (!result) {
        logger.error(
          { appId: appData._id, host: data.host, port: data.port },
          "SMTP connection verification failed"
        );
        throw new ConnectedAppError(
          "smtp.statusText.connection_verification_failed"
        );
      }

      logger.debug(
        { appId: appData._id, host: data.host, port: data.port },
        "SMTP connection verified successfully"
      );

      const status: ConnectedAppStatusWithText = {
        status: "connected",
        statusText: "smtp.statusText.successfully_connected",
      };

      this.props.update({
        account: {
          username: data.email,
          serverUrl: data.host,
        },
        data,
        ...status,
      });

      logger.info(
        { appId: appData._id, host: data.host, email: data.email },
        "Successfully connected to SMTP server"
      );

      logger.debug(
        { appId: appData._id, status: status.status },
        "Successfully configured SMTP"
      );

      return status;
    } catch (e: any) {
      logger.error(
        {
          appId: appData._id,
          host: data.host,
          error: e?.message || e?.toString(),
        },
        "Error processing SMTP configuration request"
      );

      const status: ConnectedAppStatusWithText = {
        status: "failed",
        statusText:
          e instanceof ConnectedAppError
            ? {
                key: e.key,
                args: e.args,
              }
            : "smtp.statusText.error_processing_configuration",
      };

      this.props.update({
        ...status,
      });

      return status;
    }
  }

  public async sendMail(
    appData: ConnectedAppData,
    email: Email
  ): Promise<EmailResponse> {
    const logger = this.loggerFactory("sendMail");
    logger.debug(
      {
        appId: appData._id,
        subject: email.subject,
        to: Array.isArray(email.to) ? email.to : [email.to],
        hasAttachments: !!email.attachments?.length,
        hasIcalEvent: !!email.icalEvent,
      },
      "Sending email via SMTP"
    );

    try {
      const smtpConfiguration = appData.data as SmtpConfiguration;

      logger.debug(
        { appId: appData._id, subject: email.subject },
        "Processing email attachments and iCal events"
      );

      let icalEvent: Mail.IcalAttachment | undefined = undefined;
      if (email.icalEvent) {
        logger.debug(
          { appId: appData._id, subject: email.subject },
          "Processing iCal event attachment"
        );

        const { value: icsContent, error: icsError } = createEvent(
          email.icalEvent.content
        );

        if (!icsContent || icsError) {
          logger.error(
            { appId: appData._id, icsError },
            "Failed to parse iCal event"
          );
          throw new ConnectedAppError(
            "smtp.statusText.error_parsing_ical_event"
          );
        }

        icalEvent = {
          filename: email.icalEvent.filename || "invitation.ics",
          method: email.icalEvent.method,
          content: icsContent,
        };

        logger.debug(
          {
            appId: appData._id,
            subject: email.subject,
            filename: icalEvent.filename,
          },
          "Successfully created iCal event attachment"
        );
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

      logger.debug(
        {
          appId: appData._id,
          subject: email.subject,
          from: smtpConfiguration.email,
          to: Array.isArray(email.to) ? email.to : [email.to],
          attachmentCount: email.attachments?.length || 0,
        },
        "Prepared email options, sending via SMTP"
      );

      const client = this.getClient(smtpConfiguration);
      const result = await client.sendMail(mailOptions);

      logger.info(
        {
          appId: appData._id,
          subject: email.subject,
          messageId: result.messageId,
        },
        "Successfully sent email via SMTP"
      );

      return {
        messageId: result.messageId,
      };
    } catch (e: any) {
      logger.error(
        {
          appId: appData._id,
          subject: email.subject,
          error: e?.message || e?.toString(),
        },
        "Error sending email via SMTP"
      );

      const status: ConnectedAppStatusWithText = {
        status: "failed",
        statusText:
          e instanceof ConnectedAppError
            ? {
                key: e.key,
                args: e.args,
              }
            : "smtp.statusText.error_sending_email",
      };

      this.props.update({
        ...status,
      });

      throw e;
    }
  }

  protected getClient(smtpConfiguration: SmtpConfiguration) {
    const logger = this.loggerFactory("getClient");
    logger.debug(
      {
        host: smtpConfiguration.host,
        port: smtpConfiguration.port,
        secure: smtpConfiguration.secure,
        email: smtpConfiguration.email,
      },
      "Creating SMTP client"
    );

    try {
      const client = nodemailer.createTransport({
        host: smtpConfiguration.host,
        port: smtpConfiguration.port,
        secure: smtpConfiguration.secure,
        auth: {
          user: smtpConfiguration.auth.user,
          pass: smtpConfiguration.auth.pass,
        },
      });

      logger.debug(
        { host: smtpConfiguration.host, port: smtpConfiguration.port },
        "SMTP client created successfully"
      );

      return client;
    } catch (error: any) {
      logger.error(
        {
          host: smtpConfiguration.host,
          port: smtpConfiguration.port,
          error: error?.message || error?.toString(),
        },
        "Error creating SMTP client"
      );
      throw error;
    }
  }
}
