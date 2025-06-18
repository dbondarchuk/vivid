import { getLoggerFactory } from "@vivid/logger";
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
  protected readonly loggerFactory = getLoggerFactory("PaymentsService");

  public constructor(
    protected readonly connectedAppsService: IConnectedAppsService
  ) {}
  public async createIntent(
    intent: Omit<PaymentIntentUpdateModel, "status">
  ): Promise<PaymentIntent> {
    const logger = this.loggerFactory("createIntent");
    logger.debug(
      {
        intent: {
          amount: intent.amount,
          appId: intent.appId,
          appointmentId: intent.appointmentId,
          customerId: intent.customerId,
          appName: intent.appName,
        },
      },
      "Creating payment intent"
    );

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

    logger.debug(
      {
        intentId: dbIntent._id,
        amount: dbIntent.amount,
        appId: dbIntent.appId,
        appointmentId: dbIntent.appointmentId,
        customerId: dbIntent.customerId,
        appName: dbIntent.appName,
      },
      "Successfully created payment intent"
    );

    return dbIntent;
  }

  public async getIntent(id: string): Promise<PaymentIntent | null> {
    const logger = this.loggerFactory("getIntent");
    logger.debug({ intentId: id }, "Getting payment intent by id");

    const db = await getDbConnection();
    const intents = db.collection<PaymentIntent>(
      PAYMENT_INTENTS_COLLECTION_NAME
    );

    const intent = await intents.findOne({
      _id: id,
    });

    if (!intent) {
      logger.warn({ intentId: id }, "Payment intent not found");
    } else {
      logger.debug(
        {
          intentId: id,
          status: intent.status,
          amount: intent.amount,
          appId: intent.appId,
          appointmentId: intent.appointmentId,
          customerId: intent.customerId,
          appName: intent.appName,
        },
        "Payment intent found"
      );
    }

    return intent;
  }

  public async getIntentByExternalId(
    externalId: string
  ): Promise<PaymentIntent | null> {
    const logger = this.loggerFactory("getIntentByExternalId");
    logger.debug({ externalId }, "Getting payment intent by external id");

    const db = await getDbConnection();
    const intents = db.collection<PaymentIntent>(
      PAYMENT_INTENTS_COLLECTION_NAME
    );

    const intent = await intents.findOne({
      externalId,
    });

    if (!intent) {
      logger.warn({ externalId }, "Payment intent not found by external id");
    } else {
      logger.debug(
        {
          externalId,
          intentId: intent._id,
          status: intent.status,
          amount: intent.amount,
          appId: intent.appId,
        },
        "Payment intent found by external id"
      );
    }

    return intent;
  }

  public async updateIntent(
    id: string,
    update: Partial<PaymentIntentUpdateModel>
  ): Promise<PaymentIntent> {
    const logger = this.loggerFactory("updateIntent");
    logger.debug({ intentId: id, update }, "Updating payment intent");

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

    if (!updatedIntent) {
      logger.error({ intentId: id }, "Failed to fetch updated intent");
      throw new Error("Failed to fetch updated intent");
    }

    logger.debug(
      { intentId: id, status: updatedIntent.status },
      "Successfully updated payment intent"
    );
    return updatedIntent;
  }

  public async createPayment(payment: PaymentUpdateModel): Promise<Payment> {
    const logger = this.loggerFactory("createPayment");
    logger.debug(
      {
        payment: {
          amount: payment.amount,
          type: payment.type,
          appId: "appId" in payment ? payment.appId : undefined,
          appName: "appName" in payment ? payment.appName : undefined,
          appointmentId: payment.appointmentId,
          customerId: payment.customerId,
        },
      },
      "Creating payment"
    );

    const db = await getDbConnection();
    const payments = db.collection<Payment>(PAYMENTS_COLLECTION_NAME);

    const dbPayment: Payment = {
      ...payment,
      _id: new ObjectId().toString(),
      updatedAt: new Date(),
    };

    await payments.insertOne(dbPayment);

    logger.debug(
      { paymentId: dbPayment._id, amount: dbPayment.amount },
      "Successfully created payment"
    );

    return dbPayment;
  }

  public async getPayment(id: string): Promise<Payment | null> {
    const logger = this.loggerFactory("getPayment");
    logger.debug({ paymentId: id }, "Getting payment by id");

    const db = await getDbConnection();
    const payments = db.collection<Payment>(PAYMENTS_COLLECTION_NAME);

    const payment = await payments.findOne({
      _id: id,
    });

    if (!payment) {
      logger.warn({ paymentId: id }, "Payment not found");
    } else {
      logger.debug(
        {
          paymentId: id,
          status: payment.status,
          amount: payment.amount,
          type: payment.type,
          appId: "appId" in payment ? payment.appId : undefined,
          appName: "appName" in payment ? payment.appName : undefined,
          appointmentId: payment.appointmentId,
          customerId: payment.customerId,
        },
        "Payment found"
      );
    }

    return payment;
  }

  public async updatePayment(
    id: string,
    update: Partial<PaymentUpdateModel>
  ): Promise<Payment> {
    const logger = this.loggerFactory("updatePayment");
    logger.debug({ paymentId: id, update }, "Updating payment");

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

    if (!updatedPayment) {
      logger.error({ paymentId: id }, "Failed to fetch updated payment");
      throw new Error("Failed to fetch updated intent");
    }

    logger.debug(
      { paymentId: id, status: updatedPayment.status },
      "Successfully updated payment"
    );

    return updatedPayment;
  }

  public async refundPayment(
    id: string
  ): Promise<
    | { success: false; error: string; status: number }
    | { success: true; updatedPayment: Payment }
  > {
    const logger = this.loggerFactory("refundPayment");
    logger.debug({ paymentId: id }, "Processing payment refund");

    const payment = await this.getPayment(id);
    if (!payment) {
      logger.warn({ paymentId: id }, "Payment not found for refund");
      return { success: false, error: "payment_not_found", status: 404 };
    }

    if (payment.type !== "online") {
      logger.error(
        { paymentId: id, type: payment.type },
        "Only online payments supported for refund"
      );

      return {
        success: false,
        error: "only_online_payments_supported",
        status: 405,
      };
    }

    if (payment.status !== "paid") {
      logger.error(
        { paymentId: id, status: payment.status },
        "Wrong payment status for refund"
      );

      return { success: false, error: "wrong_payment_status", status: 405 };
    }

    try {
      const { app, service } =
        await this.connectedAppsService.getAppService<IPaymentProcessor>(
          payment.appId
        );
      if (!service.refundPayment) {
        logger.error(
          { paymentId: id, appId: payment.appId },
          "Refund not supported by payment app"
        );

        throw new Error("refund_not_supported");
      }

      const result = await service.refundPayment(app, payment);
      if (result.success) {
        const updatedPayment = await this.updatePayment(id, {
          status: "refunded",
        });

        logger.debug(
          { paymentId: id },
          "Successfully processed payment refund"
        );

        return { success: true, updatedPayment };
      }

      logger.error(
        { paymentId: id, error: result.error },
        "Payment app refund failed"
      );

      return {
        success: false,
        status: 400,
        error: result.error || "app_does_not_support_refund",
      };
    } catch (error) {
      logger.error(
        { paymentId: id, error },
        "Payment app does not support refund"
      );

      return {
        success: false,
        error: "app_does_not_support_refund",
        status: 405,
      };
    }
  }
}
