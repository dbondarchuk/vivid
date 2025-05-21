import {
  ApiRequest,
  CalendarBusyTime,
  CalendarEvent,
  CalendarEventAttendee,
  CalendarEventResult,
  ConnectedAppData,
  ConnectedAppResponse,
  ICalendarBusyTimeProvider,
  ICalendarWriter,
  IConnectedAppProps,
  IOAuthConnectedApp,
  okStatus,
} from "@vivid/types";
import { DateTime } from "luxon";
import { env } from "process";

import {
  calendar_v3,
  auth as googleAuth,
  calendar as googleCalendar,
} from "@googleapis/calendar";
import { Credentials, OAuth2Client } from "google-auth-library";
import {
  CalendarListItem,
  GoogleCalendarConfiguration,
  RequestAction,
} from "./models";

const accessType = "offline";

// Redirect request won't contain offline access
const requiredScopes = [
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/calendar",
];

const attendeeStatusToResponseStatusMap: Record<
  CalendarEventAttendee["status"],
  string
> = {
  confirmed: "accepted",
  declined: "declined",
  tentative: "tentative",
  organizer: "accepted",
};

const evetStatusToGoogleEventStatus: Record<CalendarEvent["status"], string> = {
  confirmed: "accepted",
  declined: "cancelled",
  pending: "tentative",
};

const base32hexAlphabet = "0123456789abcdefghijklmnopqrstuv";
const base32hexEncode = (str: string): string => {
  let binary = "";
  for (let i = 0; i < str.length; i++) {
    const byte = str.charCodeAt(i);
    binary += byte.toString(2).padStart(8, "0");
  }

  let encoded = "";
  for (let i = 0; i < binary.length; i += 5) {
    const chunk = binary.slice(i, i + 5).padEnd(5, "0");
    const index = parseInt(chunk, 2);
    encoded += base32hexAlphabet[index];
  }

  return encoded;
};

class GoogleCalendarConnectedApp
  implements IOAuthConnectedApp, ICalendarBusyTimeProvider, ICalendarWriter
{
  public constructor(protected readonly props: IConnectedAppProps) {}

  public async processRequest(
    appData: ConnectedAppData<GoogleCalendarConfiguration>,
    data: RequestAction
  ) {
    switch (data.type) {
      case "get-selected-calendar":
        return appData.data?.calendar?.id;

      case "get-calendar-list":
        return await this.getCalendarList(appData);

      case "set-calendar":
        await this.props.update({
          data: {
            ...(appData.data ?? {}),
            calendar: data.calendar,
          },
          account: {
            ...((appData.account as any) ?? {}),
            additional: data.calendar.name,
          },
        });

        return;

      default:
        return okStatus;
    }
  }

  public async getLoginUrl(appId: string): Promise<string> {
    const client = await this.getOAuthClient();
    const url = client.generateAuthUrl({
      access_type: accessType,

      // If you only need one scope, you can pass it as a string
      scope: requiredScopes,
      state: appId,
      prompt: "consent",
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
      if (!tokens?.access_token || !tokens.refresh_token || !tokens.id_token) {
        throw new Error("App was not authorized properly");
      }

      if (!requiredScopes.every((s) => !!tokens.scope?.includes(s))) {
        throw new Error("App was not given required scopes");
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
    app: ConnectedAppData<GoogleCalendarConfiguration>,
    start: Date,
    end: Date
  ): Promise<CalendarBusyTime[]> {
    const client = await this.getOAuthClientWithCredentials(app);

    try {
      const events = await this.getEvents(
        client,
        DateTime.fromJSDate(start),
        DateTime.fromJSDate(end),
        app.data?.calendar?.id
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

          const uid =
            event.extendedProperties?.private?.uid ??
            (event as any).uid ??
            event.iCalUID;

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

  public async createEvent(
    app: ConnectedAppData<GoogleCalendarConfiguration>,
    event: CalendarEvent
  ): Promise<CalendarEventResult> {
    const client = await this.getOAuthClientWithCredentials(app);
    const calendarClient = googleCalendar({
      version: "v3",
      auth: client,
    });

    const googleEvent = this.getGoogleEvent(event);

    const result = await calendarClient.events.insert({
      calendarId: app.data?.calendar?.id ?? "primary",
      sendNotifications: true,
      requestBody: googleEvent,
    });

    return {
      uid: result.data.iCalUID ?? event.uid,
    };
  }

  public async updateEvent(
    app: ConnectedAppData<GoogleCalendarConfiguration>,
    uid: string,
    event: CalendarEvent
  ): Promise<CalendarEventResult> {
    const client = await this.getOAuthClientWithCredentials(app);
    const calendarClient = googleCalendar({
      version: "v3",
      auth: client,
    });

    const result = await calendarClient.events.patch({
      calendarId: app.data?.calendar?.id ?? "primary",
      eventId: base32hexEncode(uid),
      requestBody: this.getGoogleEvent(event),
    });

    return {
      uid: result.data.iCalUID ?? event.uid,
    };
  }

  public async deleteEvent(
    app: ConnectedAppData<GoogleCalendarConfiguration>,
    uid: string
  ): Promise<void> {
    const client = await this.getOAuthClientWithCredentials(app);
    const calendarClient = googleCalendar({
      version: "v3",
      auth: client,
    });

    await calendarClient.events.delete({
      eventId: base32hexEncode(uid),
      calendarId: app.data?.calendar?.id ?? "primary",
    });
  }

  private async getCalendarList(app: ConnectedAppData) {
    const client = await this.getOAuthClientWithCredentials(app);
    const calendarClient = googleCalendar({
      version: "v3",
      auth: client,
    });

    const list = await calendarClient.calendarList.list({});
    return list.data.items?.map(
      (item) =>
        ({
          id: item.id!,
          name: item.summary!,
        }) as CalendarListItem
    );
  }

  private getGoogleEvent(event: CalendarEvent): calendar_v3.Schema$Event {
    const start = DateTime.fromJSDate(event.startTime).setZone(event.timeZone);
    const end = start.plus({ minutes: event.duration });
    return {
      summary: event.title,
      description: event.description.plainText,
      source: {
        title: event.title,
        url: event.description.url,
      },
      start: {
        dateTime: start.toISO(),
        timeZone: event.timeZone,
      },
      id: base32hexEncode(event.uid),
      status: evetStatusToGoogleEventStatus[event.status],
      end: {
        dateTime: end.toISO(),
        timeZone: event.timeZone,
      },
      location: event.location.address ?? event.location.name,
      extendedProperties: {
        private: {
          uid: event.uid,
        },
      },
      attendees: event.attendees.map((attendee) => ({
        email: attendee.email,
        displayName: attendee.name,
        organizer: attendee.status === "organizer",
        optional: attendee.type === "optional",
        responseStatus: attendeeStatusToResponseStatusMap[attendee.status],
      })),
    };
  }

  private async getEventsPaginated(
    client: OAuth2Client,
    start: DateTime,
    end: DateTime,
    top: number,
    pageToken?: string,
    calendarId?: string
  ) {
    const calendarClient = googleCalendar({
      version: "v3",
      auth: client,
    });

    return await calendarClient.events.list({
      calendarId: calendarId ?? "primary",
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
    end: DateTime,
    calendarId?: string
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
        pageToken,
        calendarId
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
