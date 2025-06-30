import { WithDatabaseId } from "../database";
import { Prettify } from "../utils/helpers";
import { AppointmentStatus } from "./appointment";
import { PaymentStatus, PaymentType } from "./payment";

export type PaymentHistory = {
  id: string;
  amount: number;
  status: PaymentStatus;
  type: PaymentType;
  intentId?: string;
  externalId?: string;
  appName?: string;
  appId?: string;
};

type AppointmentHistoryTypes = {
  created: {
    by: "customer" | "user";
    confirmed: boolean;
    payment?: PaymentHistory;
  };
  statusChanged: {
    oldStatus: AppointmentStatus;
    newStatus: AppointmentStatus;
  };
  rescheduled: {
    oldDateTime: Date;
    newDateTime: Date;
  };
  paymentAdded: {
    payment: PaymentHistory;
  };
  paymentRefunded: {
    payment: PaymentHistory;
  };
};

type AppointmentHistoryEvent = {
  [K in keyof AppointmentHistoryTypes]: Prettify<{
    type: K;
    data: AppointmentHistoryTypes[K];
  }>;
}[keyof AppointmentHistoryTypes];

export type AppointmentHistoryEntry = Prettify<
  WithDatabaseId<
    {
      appointmentId: string;
      dateTime: Date;
    } & AppointmentHistoryEvent
  >
>;
