import { WithDatabaseId } from "../database";
import { Prettify } from "../utils/helpers";
import { Appointment, AppointmentStatus } from "./appointment";
import { AppointmentDiscount } from "./appointment-event";
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
    refundedAmount: number;
    totalRefunded: number;
  };
  updated: {
    oldOption: {
      _id: string;
      name: string;
    };
    newOption: {
      _id: string;
      name: string;
    };
    oldFields: Appointment["fields"];
    newFields: Appointment["fields"];
    oldAddons:
      | {
          _id: string;
          name: string;
        }[]
      | undefined;
    newAddons:
      | {
          _id: string;
          name: string;
        }[]
      | undefined;
    oldDiscount: AppointmentDiscount | undefined;
    newDiscount: AppointmentDiscount | undefined;
    oldNote: string | undefined;
    newNote: string | undefined;
    oldDateTime: Date;
    newDateTime: Date;
    oldDuration: number;
    newDuration: number;
    oldTotalPrice: number;
    newTotalPrice: number;
    oldTotalDuration: number;
    newTotalDuration: number;
    oldStatus: AppointmentStatus;
    newStatus: AppointmentStatus;
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
