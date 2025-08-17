import {
  ApplyDiscountResponse,
  AppointmentRequest,
  Payment,
  PaymentIntent,
} from "../../booking";
import { ConnectedAppData } from "../connected-app.data";

export interface IPaymentProcessor {
  getFormProps: (appData: ConnectedAppData) => Record<string, any>;
  refundPayment?: (
    appDate: ConnectedAppData,
    payment: Payment,
    amount: number
  ) => Promise<{ success: boolean; error?: string }>;
}

export type PaymentAppFormProps<T extends Record<string, any>> = Pick<
  AppointmentRequest,
  "addonsIds" | "fields" | "optionId"
> & {
  fields: AppointmentRequest["fields"];
  totalPrice: number;
  discount?: ApplyDiscountResponse;
  intent: PaymentIntent;
  onSubmit: () => void;
} & T;
