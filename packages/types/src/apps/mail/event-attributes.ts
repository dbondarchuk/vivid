export type DateArray =
  | [number, number, number, number, number]
  | [number, number, number, number]
  | [number, number, number];

export type EventDateTime = DateArray | number | string;

export type DurationObject = {
  weeks?: number;
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
  before?: boolean;
};

export type GeoCoordinates = {
  lat: number;
  lon: number;
};

export type EventStatus = "TENTATIVE" | "CONFIRMED" | "CANCELLED";

export type ParticipationStatus =
  | "NEEDS-ACTION"
  | "ACCEPTED"
  | "DECLINED"
  | "TENTATIVE"
  | "DELEGATED"
  | "COMPLETED"
  | "IN-PROCESS";

export type ParticipationRole =
  | "CHAIR"
  | "REQ-PARTICIPANT"
  | "OPT-PARTICIPANT"
  | "NON-PARTICIPANT";

export type ParticipationType =
  | "INDIVIDUAL"
  | "GROUP"
  | "RESOURCE"
  | "ROOM"
  | "UNKNOWN";

export type Person = {
  name?: string;
  email?: string;
  dir?: string;
};

export type Attendee = Person & {
  rsvp?: boolean;
  partstat?: ParticipationStatus;
  role?: ParticipationRole;
  cutype?: ParticipationType;
  xNumGuests?: number;
};

export type ActionType = "audio" | "display" | "email" | "procedure";
export type classificationType = "PUBLIC" | "PRIVATE" | "CONFIDENTIAL" | string;

export type Alarm = {
  action?: ActionType;
  description?: string;
  summary?: string;
  duration?: DurationObject;
  trigger?: DurationObject | EventDateTime;
  repeat?: number;
  attachType?: string;
  attach?: string;
};

export type HeaderAttributes = {
  productId?: string;
  method?: string;
  calName?: string;
};

export type EventAttributes = {
  start: EventDateTime;
  startInputType?: "local" | "utc";
  startOutputType?: "local" | "utc";

  endInputType?: "local" | "utc";
  endOutputType?: "local" | "utc";

  title?: string;
  description?: string;

  location?: string;
  geo?: GeoCoordinates;

  url?: string;
  status?: EventStatus;
  busyStatus?: "FREE" | "BUSY" | "TENTATIVE" | "OOF";
  transp?: "TRANSPARENT" | "OPAQUE";

  organizer?: Person & {
    sentBy?: string;
  };

  attendees?: Attendee[];

  categories?: string[];
  alarms?: Alarm[];

  productId?: HeaderAttributes["productId"];
  uid?: string;
  method?: HeaderAttributes["method"];
  recurrenceRule?: string;
  exclusionDates?: EventDateTime[];
  sequence?: number;
  calName?: HeaderAttributes["calName"];
  classification?: classificationType;
  created?: EventDateTime;
  lastModified?: EventDateTime;
  htmlContent?: string;
} & ({ end: EventDateTime } | { duration: DurationObject });
