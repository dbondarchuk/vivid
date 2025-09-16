import { DateTime } from "luxon";

export type BookingProps = {
  successPage?: string | null;
  className?: string;
};

export type CheckCloseAppointmentsResponse =
  | {
      hasCloseAppointments: false;
    }
  | {
      hasCloseAppointments: true;
      closestAppointment: DateTime;
    };
