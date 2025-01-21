import { Services } from "@/lib/services";
import {
  CalendarBusyTime,
  ConnectedAppData,
  ConnectedAppResponse,
  ConnectedOauthAppTokens,
  ICalendarBusyTimeProvider,
  IConnectedAppProps,
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
import { Event as OutlookEvent } from "@microsoft/microsoft-graph-types";
import { DateTime } from "luxon";
import { NextRequest } from "next/server";
import { env } from "process";

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
  implements IOAuthConnectedApp, ICalendarBusyTimeProvider
{
  public constructor(protected readonly props: IConnectedAppProps) {}

  public async processRequest(data: any): Promise<void> {
    // do nothing;
  }

  public async getLoginUrl(appId: string, baseUrl: string): Promise<string> {
    const client = this.getMsalClient();
    const authParams = this.getAuthParams(appId, baseUrl);

    const authUrl = await client.getAuthCodeUrl(authParams);
    return authUrl;
  }

  public async processRedirect(
    request: NextRequest,
    baseUrl: string
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
      ...this.getAuthParams(appId, baseUrl),
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

    const accessToken = this.getOrRefreshAuthToken(app._id, tokens);

    const client = Client.initWithMiddleware({
      authProvider: {
        getAccessToken: async () => await accessToken,
      },
    });

    try {
      const events = await this.getEvents(client, start, end);
      return events
        .filter(
          (event) =>
            event.start && event.end && event.subject && event.showAs !== "free"
        )
        .map(
          (event) =>
            ({
              startAt: DateTime.fromISO(event.start?.dateTime!),
              endAt: DateTime.fromISO(event.end?.dateTime!),
              uid: (event as any).uid || event.iCalUId,
              title: event.subject!,
            } satisfies CalendarBusyTime)
        );
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

  private async getOrRefreshAuthToken(
    appId: string,
    currentTokens: ConnectedOauthAppTokens
  ): Promise<string> {
    if (!currentTokens.expiresOn || currentTokens.expiresOn <= new Date()) {
      return currentTokens.accessToken;
    }

    const client = this.getMsalClient();
    const { url } = await Services.ConfigurationService().getConfiguration(
      "general"
    );

    const tokenRequest = {
      ...this.getAuthParams(appId, url),
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

  private getAuthParams(
    appId: string,
    baseUrl: string
  ): AuthorizationUrlRequest {
    return {
      scopes,
      redirectUri: `${baseUrl}/api/apps/oauth/outlook/redirect`,
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
