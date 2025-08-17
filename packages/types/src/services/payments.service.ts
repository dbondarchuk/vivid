import {
  Payment,
  PaymentIntent,
  PaymentIntentUpdateModel,
  PaymentUpdateModel,
} from "../booking";

export interface IPaymentsService {
  createIntent(
    intent: Omit<PaymentIntentUpdateModel, "status">
  ): Promise<PaymentIntent>;

  getIntent(id: string): Promise<PaymentIntent | null>;
  getIntentByExternalId(externalId: string): Promise<PaymentIntent | null>;

  updateIntent(
    id: string,
    update: Partial<PaymentIntentUpdateModel>
  ): Promise<PaymentIntent>;

  createPayment(payment: PaymentUpdateModel): Promise<Payment>;

  getPayment(id: string): Promise<Payment | null>;

  updatePayment(
    id: string,
    update: Partial<PaymentUpdateModel>
  ): Promise<Payment>;

  refundPayment(
    id: string,
    amount: number
  ): Promise<
    | { success: false; error: string; status: number }
    | { success: true; updatedPayment: Payment }
  >;
}
