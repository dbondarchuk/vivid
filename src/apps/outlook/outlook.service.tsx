import { Services } from "@/lib/services";
import {
  CalendarBusyTime,
  ConnectedAppData,
  ConnectedAppResponse,
  ConnectedOauthAppTokens,
  Email,
  EmailResponse,
  ICalendarBusyTimeProvider,
  IConnectedAppProps,
  IMailSender,
  IOAuthConnectedApp,
} from "@/types";
import {
  AuthenticationResult,
  AuthorizationUrlRequest,
  ConfidentialClientApplication,
  LogLevel,
  Configuration as MsalConfig,
} from "@azure/msal-node";
import { Client, ClientOptions } from "@microsoft/microsoft-graph-client";
import {
  Attachment,
  FileAttachment,
  Event as OutlookEvent,
  Message as OutlookMessage,
} from "@microsoft/microsoft-graph-types";
import { createEvent } from "ics";
import { DateTime } from "luxon";
import { NextRequest } from "next/server";
import { env } from "process";
import { v4 } from "uuid";

const offlineAccessScope = "offline_access";

// Redirect request won't contain offline access
const requiredScopes = [
  "openid",
  "profile",
  "Calendars.ReadWrite",
  "Mail.Send",
];

const scopes = [...requiredScopes, offlineAccessScope];

export class OutlookConnectedApp
  implements IOAuthConnectedApp, ICalendarBusyTimeProvider, IMailSender
{
  public constructor(protected readonly props: IConnectedAppProps) {}

  public async processWebhook(
    appData: ConnectedAppData,
    request: NextRequest
  ): Promise<void> {
    // do nothing
  }

  public async processRequest(
    appData: ConnectedAppData,
    data: any
  ): Promise<void> {
    // do nothing;
  }

  public async getLoginUrl(appId: string): Promise<string> {
    const client = this.getMsalClient();
    const authParams = await this.getAuthParams(appId);

    const authUrl = await client.getAuthCodeUrl(authParams);
    return authUrl;
  }

  public async processRedirect(
    request: NextRequest
  ): Promise<ConnectedAppResponse> {
    const appId = request.nextUrl.searchParams.get("state");
    const code = request.nextUrl.searchParams.get("code");

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
        data: tokens,
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
    start: DateTime,
    end: DateTime,
    excludedUids?: string[]
  ): Promise<CalendarBusyTime[]> {
    const tokens = app.data as ConnectedOauthAppTokens;
    if (!tokens?.accessToken) {
      throw new Error("No token provided");
    }

    const client = await this.getClient(app._id, tokens);

    try {
      const events = await this.getEvents(client, start, end);
      return events
        .filter(
          (event) =>
            event.start && event.end && event.subject && event.showAs !== "free"
        )
        .map((event) => {
          const startAt = DateTime.fromISO(event.start?.dateTime!, {
            zone: "utc",
          });

          const endAt = DateTime.fromISO(event.end?.dateTime!, { zone: "utc" });

          return {
            startAt,
            endAt,
            uid: (event as any).uid || event.iCalUId,
            title: event.subject!,
          } satisfies CalendarBusyTime;
        });
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
    const tokens = app.data as ConnectedOauthAppTokens;
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
          "@odata.type": "#microsoft.graph.fileAttachment",
          contentType: `application/ics; charset=utf-8; method=${email.icalEvent.method.toUpperCase()}`,
          name: email.icalEvent.filename || "invitation.ics",
          contentBytes: Buffer.from(icsContent).toString("base64"),
        } satisfies FileAttachment);
      }
    }

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

      await client.api("/me/sendMail").post(sendMail);

      return {
        messageId,
      };
    } catch (e: any) {
      this.props.update({
        status: "failed",
        statusText: e?.message || "Failed to get events",
      });

      throw e;
    }
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
        data: {
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
    const { url } = await Services.ConfigurationService().getConfiguration(
      "general"
    );

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
