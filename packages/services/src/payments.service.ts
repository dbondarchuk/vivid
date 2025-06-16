import {
  IConnectedAppsService,
  IPaymentProcessor,
  IPaymentsService,
  Payment,
  PaymentIntent,
  PaymentIntentUpdateModel,
  PaymentUpdateModel,
} from "@vivid/types";
import { ObjectId } from "mongodb";
import { getDbConnection } from "./database";

export const PAYMENT_INTENTS_COLLECTION_NAME = "payment-intents";
export const PAYMENTS_COLLECTION_NAME = "payments";

export class PaymentsService implements IPaymentsService {
  public constructor(
    protected readonly connectedAppsService: IConnectedAppsService
  ) {}
  public async createIntent(
    intent: Omit<PaymentIntentUpdateModel, "status">
  ): Promise<PaymentIntent> {
    const db = await getDbConnection();
    const intents = db.collection<PaymentIntent>(
      PAYMENT_INTENTS_COLLECTION_NAME
    );

    const dbIntent: PaymentIntent = {
      ...intent,
      _id: new ObjectId().toString(),
      status: "created",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await intents.insertOne(dbIntent);

    return dbIntent;
  }

  public async getIntent(id: string): Promise<PaymentIntent | null> {
    const db = await getDbConnection();
    const intents = db.collection<PaymentIntent>(
      PAYMENT_INTENTS_COLLECTION_NAME
    );

    return await intents.findOne({
      _id: id,
    });
  }

  public async getIntentByExternalId(
    externalId: string
  ): Promise<PaymentIntent | null> {
    const db = await getDbConnection();
    const intents = db.collection<PaymentIntent>(
      PAYMENT_INTENTS_COLLECTION_NAME
    );

    return await intents.findOne({
      externalId,
    });
  }

  public async updateIntent(
    id: string,
    update: Partial<PaymentIntentUpdateModel>
  ): Promise<PaymentIntent> {
    const { _id: _, paidAt, ...updateObj } = update as PaymentIntent; // Remove fields in case it slips here
    const db = await getDbConnection();
    const intents = db.collection<PaymentIntent>(
      PAYMENT_INTENTS_COLLECTION_NAME
    );

    const $set: Partial<PaymentIntent> = {
      ...updateObj,
      updatedAt: new Date(),
    };

    if (updateObj.status === "paid") {
      $set.paidAt = new Date();
    }

    await intents.updateOne(
      {
        _id: id,
      },
      {
        $set,
      }
    );

    const updatedIntent = await intents.findOne({
      _id: id,
    });

    if (!updatedIntent) throw new Error("Failed to fetch updated intent");
    return updatedIntent;
  }

  public async createPayment(payment: PaymentUpdateModel): Promise<Payment> {
    const db = await getDbConnection();
    const payments = db.collection<Payment>(PAYMENTS_COLLECTION_NAME);

    const dbPayment: Payment = {
      ...payment,
      _id: new ObjectId().toString(),
      updatedAt: new Date(),
    };

    await payments.insertOne(dbPayment);

    return dbPayment;
  }

  public async getPayment(id: string): Promise<Payment | null> {
    const db = await getDbConnection();
    const payments = db.collection<Payment>(PAYMENTS_COLLECTION_NAME);

    return await payments.findOne({
      _id: id,
    });
  }

  public async updatePayment(
    id: string,
    update: Partial<PaymentUpdateModel>
  ): Promise<Payment> {
    const { _id: _, refundedAt, ...updateObj } = update as Payment; // Remove fields in case it slips here
    const db = await getDbConnection();
    const payments = db.collection<Payment>(PAYMENTS_COLLECTION_NAME);

    const $set: Partial<Payment> = {
      ...updateObj,
      updatedAt: new Date(),
    };

    if (updateObj.status === "refunded") {
      $set.refundedAt = new Date();
    }

    await payments.updateOne(
      {
        _id: id,
      },
      {
        $set,
      }
    );

    const updatedPayment = await payments.findOne({
      _id: id,
    });

    if (!updatedPayment) throw new Error("Failed to fetch updated intent");
    return updatedPayment;
  }

  public async refundPayment(
    id: string
  ): Promise<
    | { success: false; error: string; status: number }
    | { success: true; updatedPayment: Payment }
  > {
    const payment = await this.getPayment(id);
    if (!payment) {
      return { success: false, error: "payment_not_found", status: 404 };
    }

    if (payment.type !== "online") {
      return {
        success: false,
        error: "only_online_payments_supported",
        status: 405,
      };
    }

    if (payment.status !== "paid") {
      return { success: false, error: "wrong_payment_status", status: 405 };
    }

    try {
      const { app, service } =
        await this.connectedAppsService.getAppService<IPaymentProcessor>(
          payment.appId
        );
      if (!service.refundPayment) throw new Error("refund_not_supported");

      const result = await service.refundPayment(app, payment);
      if (result.success) {
        const updatedPayment = await this.updatePayment(id, {
          status: "refunded",
        });

        return { success: true, updatedPayment };
      }

      return {
        success: false,
        status: 400,
        error: result.error || "app_does_not_support_refund",
      };
    } catch (e) {
      return {
        success: false,
        error: "app_does_not_support_refund",
        status: 405,
      };
    }
  }
}
