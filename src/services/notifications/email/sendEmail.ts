import { Services } from "@/lib/services";
import { Email, IMailSender } from "@/types";
import { convert } from "html-to-text";

export const sendEmail = async (
  email: Email,
  initiator: string,
  appointmentId?: string
) => {
  const defaultAppsConfiguration =
    await Services.ConfigurationService().getConfiguration("defaultApps");
  const emailAppId = defaultAppsConfiguration?.email.appId;

  const { app, service } = await Services.ConnectedAppService().getAppService(
    emailAppId
  );

  const response = await (service as any as IMailSender).sendMail(app, email);

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
