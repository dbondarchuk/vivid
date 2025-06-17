import {
  AuthenticationResult,
  AuthorizationUrlRequest,
  ConfidentialClientApplication,
  LogLevel,
  Configuration as MsalConfig,
} from "@azure/msal-node";
import { Client } from "@microsoft/microsoft-graph-client";
import {
  Attachment,
  FileAttachment,
  Event as OutlookEvent,
  Message as OutlookMessage,
  ResponseType,
} from "@microsoft/microsoft-graph-types";
import {
  ApiRequest,
  CalendarBusyTime,
  CalendarEvent,
  CalendarEventAttendee,
  CalendarEventResult,
  ConnectedAppData,
  ConnectedAppResponse,
  ConnectedOauthAppTokens,
  Email,
  EmailResponse,
  ICalendarBusyTimeProvider,
  ICalendarWriter,
  IConnectedAppProps,
  IMailSender,
  IOAuthConnectedApp,
} from "@vivid/types";
import { createEvent } from "ics";
import { DateTime } from "luxon";
import { env } from "process";
import { v4 } from "uuid";

const offlineAccessScope = "offline_access";

const uidPropertyName = `String {d0594c28-e3bf-4348-aa31-32829298f576} Name uid`;

// Redirect request won't contain offline access
const requiredScopes = [
  "openid",
  "profile",
  "Calendars.ReadWrite",
  "Mail.Send",
];

const attendeeStatusToResponseStatusMap: Record<
  CalendarEventAttendee["status"],
  ResponseType
> = {
  confirmed: "accepted",
  declined: "declined",
  tentative: "tentativelyAccepted",
  organizer: "organizer",
};

const scopes = [...requiredScopes, offlineAccessScope];

class OutlookConnectedApp
  implements
    IOAuthConnectedApp,
    ICalendarBusyTimeProvider,
    IMailSender,
    ICalendarWriter
{
  public constructor(protected readonly props: IConnectedAppProps) {}

  processRequest?:
    | ((appData: ConnectedAppData, data: any) => Promise<any>)
    | undefined;

  public async getLoginUrl(appId: string): Promise<string> {
    const client = this.getMsalClient();
    const authParams = await this.getAuthParams(appId);

    const authUrl = await client.getAuthCodeUrl(authParams);
    return authUrl;
  }

  public async processRedirect(
    request: ApiRequest
  ): Promise<ConnectedAppResponse> {
    const url = new URL(request.url);
    const appId = url.searchParams.get("state") as string;
    const code = url.searchParams.get("code") as string;

    if (!appId) {
      throw new Error("Redirect request does not contain app ID");
    }

    if (!code) {
      return {
        appId,
        error: "Redirect request does not contain authorization code",
      };
    }

    const client = this.getMsalClient();
    const tokenRequest = {
      ...(await this.getAuthParams(appId)),
      code,
    };

    const _tokenResponse = await client.acquireTokenByCode(tokenRequest);

    try {
      const { tokens, username } = this.parseAuthResult(
        client,
        _tokenResponse,
        true
      );

      return {
        appId,
        token: tokens,
        account: {
          username,
        },
      };
    } catch (e: any) {
      return {
        appId,
        error: e?.message || "Something went wrong",
      };
    }
  }

  public async getBusyTimes(
    app: ConnectedAppData,
    start: Date,
    end: Date
  ): Promise<CalendarBusyTime[]> {
    const tokens = app.token as ConnectedOauthAppTokens;
    if (!tokens?.accessToken) {
      throw new Error("No token provided");
    }

    const client = await this.getClient(app._id, tokens);

    try {
      const events = await this.getEvents(
        client,
        DateTime.fromJSDate(start),
        DateTime.fromJSDate(end)
      );

      const result = events
        .filter(
          (event) =>
            event.start && event.end && event.subject && event.showAs !== "free"
        )
        .map((event) => {
          const startAt = DateTime.fromISO(event.start?.dateTime!, {
            zone: "utc",
          }).toJSDate();

          const endAt = DateTime.fromISO(event.end?.dateTime!, {
            zone: "utc",
          }).toJSDate();

          const uid: string =
            event.singleValueExtendedProperties?.find(
              (p) => p.id === uidPropertyName
            )?.value ??
            (event as any).uid ??
            event.iCalUId;

          return {
            startAt,
            endAt,
            uid,
            title: event.subject!,
          } satisfies CalendarBusyTime;
        });

      this.props.update({
        status: "connected",
        statusText: "Successfully fetched events",
      });

      return result;
    } catch (e: any) {
      this.props.update({
        status: "failed",
        statusText: e?.message || "Failed to get events",
      });

      throw e;
    }
  }

  public async sendMail(
    app: ConnectedAppData,
    email: Email
  ): Promise<EmailResponse> {
    const tokens = app.token as ConnectedOauthAppTokens;
    if (!tokens?.accessToken) {
      throw new Error("No token provided");
    }

    const client = await this.getClient(app._id, tokens);

    const to = Array.isArray(email.to) ? email.to : [email.to];
    const cc = email.cc
      ? Array.isArray(email.cc)
        ? email.cc
        : [email.cc]
      : [];

    const attachments: Attachment[] = [];
    if (email.icalEvent) {
      const { value: icsContent, error: icsError } = createEvent(
        email.icalEvent.content
      );

      if (!icsContent || !!icsError) {
        console.error(icsError || "Failed to parse event");
      } else {
        attachments.push({
          // @ts-expect-error This is required
          // "@odata.type": "#microsoft.graph.itemAttachment",
          "@odata.type": "#microsoft.graph.fileAttachment",
          isInline: false,
          contentType: `text/calendar; charset=utf-8; method=${email.icalEvent.method.toUpperCase()}`,
          name: email.icalEvent.filename || "invitation.ics",
          contentBytes: Buffer.from(icsContent).toString("base64"),
        } satisfies FileAttachment);
        // attachments.push({
        //   // @ts-expect-error This is required
        //   "@odata.type": "#microsoft.graph.itemAttachment",
        //   name: email.icalEvent.filename || "invitation.ics",
        //   item: {
        //     "@odata.type": "microsoft.graph.event",
        //     attendees: email.icalEvent.content.attendees?.map((a) => ({
        //       emailAddress: {
        //         address: a.email,
        //         name: a.name,
        //       },
        //       status: {
        //         response:
        //           a.partstat === "ACCEPTED"
        //             ? "accepted"
        //             : a.partstat === "DECLINED"
        //               ? "declined"
        //               : "tentativelyAccepted",
        //       },
        //     })),
        //     allowNewTimeProposals: false,
        //     id: email.icalEvent.content.uid,
        //     isCancelled: email.icalEvent.content.method === "CANCEL",
        //     subject: email.icalEvent.content.title,
        //     location: {
        //       address: email.icalEvent.content.location,
        //     },
        //     iCalUId: email.icalEvent.content.uid,
        //     start: {
        //       dateTime: DateTime.fromMillis(
        //         parseInt(email.icalEvent.content.start.toString())
        //       ).toISO({
        //         includeOffset: false,
        //       }),
        //       timeZone: "UTC",
        //     },
        //     end: {
        //       dateTime: DateTime.fromMillis(
        //         // @ts-ignore exists
        //         parseInt(email.icalEvent.content.end.toString())
        //       ).toISO({
        //         includeOffset: false,
        //       }),
        //       timeZone: "UTC",
        //     },
        //     originalStartTimeZone: email.icalEvent.content.startInputType,
        //     originalEndTimeZone: email.icalEvent.content.endInputType,
        //     body: {
        //       content: email.icalEvent.content.description,
        //       contentType: "html",
        //     },
        //     organizer: {
        //       emailAddress: {
        //         name: email.icalEvent.content.organizer?.name,
        //         address: email.icalEvent.content.organizer?.email,
        //       },
        //     },
        //   } as OutlookEvent,
        // } satisfies ItemAttachment);
      }
    }

    if (email.attachments) {
      for (const attachment of email.attachments) {
        attachments.push({
          // @ts-expect-error This is required
          "@odata.type": "#microsoft.graph.fileAttachment",
          name: attachment.filename,
          contentType: attachment.contentType,
          contentBytes: attachment.content.toString("base64"),
          contentId: attachment.cid,
        } satisfies FileAttachment);
      }
    }

    // let icalEvent: Mail.IcalAttachment | undefined = undefined;
    // if (email.icalEvent) {
    //   const { value: icsContent, error: icsError } = createEvent(
    //     email.icalEvent.content
    //   );
    //   icalEvent = {
    //     filename: email.icalEvent.filename || "invitation.ics",
    //     method: email.icalEvent.method,
    //     content: icsContent,
    //   };
    // }

    // const { email: from } = await this.props.services
    //   .ConfigurationService()
    //   .getConfiguration("general");
    // const mailOptions: nodemailer.SendMailOptions = {
    //   from,
    //   to: email.to,
    //   cc: email.cc,
    //   subject: email.subject,
    //   html: email.body,
    //   icalEvent: icalEvent,
    //   attachments: email.attachments?.map((attachment) => ({
    //     cid: attachment.cid,
    //     filename: attachment.filename,
    //     content: attachment.content,
    //   })),
    // };

    // let transporter = nodemailer.createTransport({
    //   streamTransport: true,
    //   // newline: "windows",
    //   buffer: true,
    // });

    try {
      const messageId = v4();
      const sendMail: {
        message: OutlookMessage;
        saveToSentItems: boolean;
      } = {
        message: {
          id: messageId,
          subject: email.subject,
          body: {
            contentType: "html",
            content: email.body,
          },
          toRecipients: to.map((address) => ({
            emailAddress: {
              address,
            },
          })),
          ccRecipients: cc.map((address) => ({
            emailAddress: {
              address,
            },
          })),
          attachments: attachments,
        },
        saveToSentItems: true,
      };

      await client
        .api("/me/sendMail")
        // .header("Content-type", "text/plain")
        .post(sendMail);

      this.props.update({
        status: "connected",
        statusText: "Successfully sent email",
      });

      return {
        messageId,
      };
    } catch (e: any) {
      this.props.update({
        status: "failed",
        statusText: e?.message || "Failed to send email",
      });

      throw e;
    }
  }

  public async createEvent(
    app: ConnectedAppData,
    event: CalendarEvent
  ): Promise<CalendarEventResult> {
    const tokens = app.token as ConnectedOauthAppTokens;
    if (!tokens?.accessToken) {
      throw new Error("No token provided");
    }

    const client = await this.getClient(app._id, tokens);

    const result = (await client
      .api("/me/calendar/events")
      .post(this.getOutlookEvent(event))) as OutlookEvent;

    return {
      uid: result.id!,
    };
  }

  public async updateEvent(
    app: ConnectedAppData,
    uid: string,
    event: CalendarEvent
  ): Promise<CalendarEventResult> {
    const tokens = app.token as ConnectedOauthAppTokens;
    if (!tokens?.accessToken) {
      throw new Error("No token provided");
    }

    const client = await this.getClient(app._id, tokens);
    const eventId = await this.getOutlookEventId(client, uid);

    const result = (await client
      .api(`/me/calendar/events/${eventId}`)
      .patch(this.getOutlookEvent(event))) as OutlookEvent;

    return {
      uid: result.id!,
    };
  }

  public async deleteEvent(app: ConnectedAppData, uid: string): Promise<void> {
    const tokens = app.token as ConnectedOauthAppTokens;
    if (!tokens?.accessToken) {
      throw new Error("No token provided");
    }

    const client = await this.getClient(app._id, tokens);

    const id = await this.getOutlookEventId(client, uid);
    await client.api(`/me/calendar/events/${id}`).delete();
  }

  private async getOutlookEventId(
    client: Client,
    uid: string
  ): Promise<string> {
    const response = await client
      .api("/me/calendar/events")
      .filter(
        `singleValueExtendedProperties/Any(ep: ep/id eq '${uidPropertyName}' and ep/value eq '${uid}')`
      )
      .select("id")
      .get();

    const id = (response.value as OutlookEvent[])?.[0]?.id;
    if (!id) {
      throw new Error(`Failed to find Outlook Event ID for UID ${uid}`);
    }

    return id;
  }

  private getOutlookEvent(event: CalendarEvent): OutlookEvent {
    const start = DateTime.fromJSDate(event.startTime)
      .setZone(event.timeZone)
      .toUTC();

    const end = start.plus({ minutes: event.duration });

    const outlookEvent: OutlookEvent = {
      subject: event.title,
      body: {
        content: event.description.html,
        contentType: "html",
      },
      start: {
        dateTime: start.toISO()!,
        timeZone: "UTC",
      },
      end: {
        dateTime: end.toISO()!,
        timeZone: "UTC",
      },
      attendees: event.attendees
        ?.filter((attendee) => attendee.status !== "organizer") // Will be added automatically
        .map((attendee) => ({
          emailAddress: {
            address: attendee.email,
            name: attendee.name,
          },
          type: attendee.type,
          status: {
            response: attendeeStatusToResponseStatusMap[attendee.status],
          },
        })),
      location: {
        displayName: `${event.location.name}${event.location.address ? `, ${event.location.address}` : ""}`,
      },
      singleValueExtendedProperties: [
        {
          id: uidPropertyName,
          value: event.uid,
        },
      ],
    };

    return outlookEvent;
  }

  private async getEventsPaginated(
    client: Client,
    start: DateTime,
    end: DateTime,
    skip: number,
    top: number
  ) {
    return await client
      .api("/me/calendarview")
      .query(`startDateTime=${start.toISO()}&endDateTime=${end.toISO()}`)
      .expand(
        `singleValueExtendedProperties($filter=id eq '${uidPropertyName}')`
      )
      // .select("uid,start,end,showAs,subject")
      .count(true)
      .skip(skip)
      .top(top)
      .get();
  }

  private async getEvents(
    client: Client,
    start: DateTime,
    end: DateTime
  ): Promise<OutlookEvent[]> {
    const results: OutlookEvent[] = [];
    let skip = 0;
    let count = 0;
    const top = 1000;
    do {
      const response = await this.getEventsPaginated(
        client,
        start,
        end,
        skip,
        top
      );
      count = response["@odata.count"];

      results.push(...(response.value as OutlookEvent[]));
      skip += top;
    } while (skip < count);

    return results;
  }

  private async getClient(
    appId: string,
    tokens: ConnectedOauthAppTokens
  ): Promise<Client> {
    const accessToken = this.getOrRefreshAuthToken(appId, tokens);

    const client = Client.initWithMiddleware({
      authProvider: {
        getAccessToken: async () => await accessToken,
      },
    });

    return client;
  }

  private async getOrRefreshAuthToken(
    appId: string,
    currentTokens: ConnectedOauthAppTokens
  ): Promise<string> {
    if (!currentTokens.expiresOn || currentTokens.expiresOn >= new Date()) {
      return currentTokens.accessToken;
    }

    const client = this.getMsalClient();

    const tokenRequest = {
      ...(await this.getAuthParams(appId)),
      refreshToken: currentTokens.refreshToken,
    };

    try {
      const result = await client.acquireTokenByRefreshToken(tokenRequest);
      if (!result) {
        throw new Error("Failed to refresh access token");
      }

      const { username, tokens } = this.parseAuthResult(client, result, false);
      this.props.update({
        account: {
          username,
        },
        token: {
          ...tokens,
          refreshToken: currentTokens.refreshToken,
        },
      });

      return tokens.accessToken!;
    } catch (e: any) {
      this.props.update({
        status: "failed",
        statusText: e?.message || "Failed to refresh access token",
      });

      throw e;
    }
  }

  private parseAuthResult(
    client: ConfidentialClientApplication,
    authResult: AuthenticationResult,
    expectRefreshToken: boolean
  ): {
    tokens: Partial<ConnectedOauthAppTokens>;
    username: string;
  } {
    const username = authResult.account?.username;
    if (!authResult.accessToken) {
      throw new Error("Authorization result does not contain access token");
    }

    if (!username) {
      throw new Error(
        "Authorization result does not contain account infromation"
      );
    }

    if (requiredScopes.some((s) => authResult.scopes.indexOf(s) < 0)) {
      throw new Error("Authorization result does not contain enough scopes");
    }

    const tokens: Partial<ConnectedOauthAppTokens> = {
      accessToken: authResult.accessToken,
      expiresOn: authResult.expiresOn,
    };

    if (expectRefreshToken) {
      const tokenCache = client.getTokenCache().serialize();
      const refreshTokenObject = JSON.parse(tokenCache).RefreshToken;
      const refreshToken =
        refreshTokenObject[Object.keys(refreshTokenObject)[0]].secret;

      if (!refreshToken) {
        throw new Error("Authorization result does not contain refresh token");
      }

      tokens.refreshToken = refreshToken;
    }

    return { tokens, username };
  }

  private async getAuthParams(appId: string): Promise<AuthorizationUrlRequest> {
    const { url } = await this.props.services
      .ConfigurationService()
      .getConfiguration("general");

    const redirectUri = `${url}/api/apps/oauth/outlook/redirect`;
    return {
      scopes,
      redirectUri,
      state: appId,
    };
  }

  private getMsalClient() {
    const msalConfig: MsalConfig = {
      auth: {
        clientId: env.OUTLOOK_APP_CLIENT_ID!,
        clientSecret: env.OUTLOOK_APP_CLIENT_SECRET,
        authority: `https://login.microsoftonline.com/${
          env.OUTLOOK_APP_TENNANT_ID || "common"
        }`,
      },
      system: {
        loggerOptions: {
          loggerCallback(loglevel, message, containsPii) {
            console.log(message);
          },
          piiLoggingEnabled: false,
          logLevel: LogLevel.Info,
        },
      },
    };

    return new ConfidentialClientApplication(msalConfig);
  }
}

export default OutlookConnectedApp;
