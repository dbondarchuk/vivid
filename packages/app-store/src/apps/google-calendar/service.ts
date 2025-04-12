import {
  ApiRequest,
  CalendarBusyTime,
  ConnectedAppData,
  ConnectedAppResponse,
  ICalendarBusyTimeProvider,
  IConnectedAppProps,
  IOAuthConnectedApp,
} from "@vivid/types";
import { DateTime } from "luxon";
import { env } from "process";

import {
  calendar_v3,
  auth as googleAuth,
  calendar as googleCalendar,
} from "@googleapis/calendar";
import { Credentials, OAuth2Client } from "google-auth-library";

const accessType = "offline";

// Redirect request won't contain offline access
const requiredScopes = [
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/calendar",
];

class GoogleCalendarConnectedApp
  implements IOAuthConnectedApp, ICalendarBusyTimeProvider
{
  public constructor(protected readonly props: IConnectedAppProps) {}

  public async processRequest(): Promise<void> {
    // do nothing;
  }

  public async getLoginUrl(appId: string): Promise<string> {
    const client = await this.getOAuthClient();
    const url = client.generateAuthUrl({
      access_type: accessType,

      // If you only need one scope, you can pass it as a string
      scope: requiredScopes,
      state: appId,
    });

    return url;
  }

  public async processRedirect(
    request: ApiRequest
  ): Promise<ConnectedAppResponse> {
    const url = new URL(request.url);
    const appId = url.searchParams.get("state") as string;
    const code = url.searchParams.get("code") as string;

    const client = await this.getOAuthClient();

    if (!appId) {
      throw new Error("Redirect request does not contain app ID");
    }

    if (!code) {
      return {
        appId,
        error: "Redirect request does not contain authorization code",
      };
    }

    try {
      const tokenResponse = await client.getToken(code);
      const tokens = tokenResponse.tokens;
      if (
        !tokens?.access_token ||
        !tokens.refresh_token ||
        !tokens.id_token ||
        !requiredScopes.every((s) => !!tokens.scope?.includes(s))
      ) {
        console.error(`Google calendar: ${JSON.stringify(tokens)}`);
        throw new Error("App was not authorized properly");
      }

      const ticket = await client.verifyIdToken({ idToken: tokens.id_token });
      const email = ticket.getPayload()?.email;
      if (!email) {
        throw new Error("Failed to get user email");
      }

      return {
        appId,
        data: tokens,
        account: {
          username: email,
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
    const client = await this.getOAuthClientWithCredentials(app);

    try {
      const events = await this.getEvents(
        client,
        DateTime.fromJSDate(start),
        DateTime.fromJSDate(end)
      );

      const result = events
        .filter(
          (event) =>
            event.start &&
            event.end &&
            event.summary &&
            event.transparency !== "transparent"
        )
        .map((event) => {
          const startAt = DateTime.fromISO(event.start?.dateTime!, {
            zone: "utc",
          }).toJSDate();

          const endAt = DateTime.fromISO(event.end?.dateTime!, {
            zone: "utc",
          }).toJSDate();

          const uid = (event as any).uid || event.iCalUID;

          return {
            startAt,
            endAt,
            uid,
            title: event.summary!,
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

  private async getEventsPaginated(
    client: OAuth2Client,
    start: DateTime,
    end: DateTime,
    top: number,
    pageToken?: string
  ) {
    const calendarClient = googleCalendar({
      version: "v3",
      auth: client,
    });

    return await calendarClient.events.list({
      calendarId: "primary",
      timeMin: start.toISO()!,
      timeMax: end.toISO()!,
      singleEvents: true,
      maxResults: top,
      pageToken: pageToken,
    });
  }

  private async getEvents(
    client: OAuth2Client,
    start: DateTime,
    end: DateTime
  ) {
    const results: calendar_v3.Schema$Event[] = [];
    let pageToken: string | undefined | null = undefined;
    const top = 1000;
    do {
      const response = await this.getEventsPaginated(
        client,
        start,
        end,
        top,
        pageToken
      );

      results.push(...(response.data.items || []));
      pageToken = response.data.nextPageToken;
    } while (!!pageToken);

    return results;
  }

  private async getOAuthClient() {
    const { url } = await this.props.services
      .ConfigurationService()
      .getConfiguration("general");

    const redirectUri = `${url}/api/apps/oauth/google-calendar/redirect`;
    // const redirectUri = `http://localhost:3000/api/apps/oauth/google-calendar/redirect`;

    return new googleAuth.OAuth2(
      env.GOOGLE_CALENDAR_APP_CLIENT_ID!,
      env.GOOGLE_CALENDAR_APP_CLIENT_SECRET,
      redirectUri
    );
  }

  private async getOAuthClientWithCredentials(appData: ConnectedAppData) {
    const client = await this.getOAuthClient();
    const credentials = appData.data as Credentials;
    if (!credentials) {
      throw new Error("App is not authorized");
    }

    client.setCredentials(appData.data);
    client.on("tokens", async (tokens) => {
      await this.props.update({
        data: {
          ...credentials,
          access_token: tokens.access_token,
          expiry_date: tokens.expiry_date,
        } as Credentials,
      });
    });

    return client;
  }
}

export default GoogleCalendarConnectedApp;
