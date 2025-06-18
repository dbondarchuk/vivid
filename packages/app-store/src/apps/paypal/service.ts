import {
  CheckoutPaymentIntent,
  Client,
  Environment,
  OrdersController,
  PaymentsController,
} from "@paypal/paypal-server-sdk";
import { getLoggerFactory } from "@vivid/logger";
import {
  ApiRequest,
  ApiResponse,
  ConnectedAppData,
  ConnectedAppStatusWithText,
  IConnectedApp,
  IConnectedAppProps,
  IPaymentProcessor,
  Payment,
} from "@vivid/types";
import { formatAmountString, maskify } from "@vivid/utils";
import { PaypalClient } from "./client";
import { PAYPAL_APP_NAME } from "./const";
import {
  CaptureOrderRequest,
  captureOrderRequestSchema,
  CreateOrderRequest,
  createOrderRequestSchema,
  PaypalConfiguration,
  paypalConfigurationSchema,
  PaypalFormProps,
} from "./models";

class PaypalConnectedApp implements IConnectedApp, IPaymentProcessor {
  protected readonly loggerFactory = getLoggerFactory("PaypalConnectedApp");

  public constructor(protected readonly props: IConnectedAppProps) {}

  public async processRequest(
    appData: ConnectedAppData,
    data: PaypalConfiguration
  ): Promise<ConnectedAppStatusWithText> {
    const logger = this.loggerFactory("processRequest");
    logger.debug(
      { appId: appData._id, clientId: maskify(data.clientId) },
      "Processing PayPal configuration request"
    );

    try {
      if (!paypalConfigurationSchema.safeParse(data).success) {
        logger.error(
          { appId: appData._id },
          "Invalid PayPal configuration data"
        );
        throw new Error("Bad data");
      }

      logger.debug({ appId: appData._id }, "Validating PayPal configuration");

      const client = await this.getSimplifiedClient({ data });
      await client.getAccessToken();

      logger.debug(
        { appId: appData._id },
        "Successfully obtained PayPal access token"
      );

      const status: ConnectedAppStatusWithText = {
        status: "connected",
        statusText: `Successfully connect to Paypal Account`,
      };

      this.props.update({
        account: {
          username: maskify(data.clientId),
        },
        data,
        ...status,
      });

      logger.info(
        { appId: appData._id, clientId: maskify(data.clientId) },
        "Successfully connected to PayPal account"
      );

      return status;
    } catch (e: any) {
      logger.error(
        { appId: appData._id, error: e?.message || e?.toString() },
        "Error processing PayPal configuration request"
      );

      const status: ConnectedAppStatusWithText = {
        status: "failed",
        statusText: e?.message || e?.toString() || "Something went wrong",
      };

      this.props.update({
        ...status,
      });

      return status;
    }
  }

  public async processAppCall(
    appData: ConnectedAppData,
    slug: string[],
    request: ApiRequest
  ): Promise<ApiResponse | undefined> {
    const logger = this.loggerFactory("processAppCall");
    logger.debug(
      { appId: appData._id, slug, method: request.method },
      "Processing PayPal app call"
    );

    if (
      slug.length === 1 &&
      slug[0] === "orders" &&
      request.method.toUpperCase() === "POST"
    ) {
      logger.debug({ appId: appData._id }, "Creating PayPal order");

      try {
        const body = await request.json();
        const { data, success, error } =
          createOrderRequestSchema.safeParse(body);
        if (!success) {
          logger.error(
            { appId: appData._id, error },
            "Invalid create order request data"
          );
          return Response.json({ success: false, error }, { status: 400 });
        }

        logger.debug(
          { appId: appData._id, paymentIntentId: data.paymentIntentId },
          "Creating PayPal order"
        );

        return await this.createOrder(appData, data);
      } catch (error: any) {
        logger.error(
          { appId: appData._id, error: error?.message || error?.toString() },
          "Error creating PayPal order"
        );
        throw error;
      }
    } else if (
      slug.length === 2 &&
      slug[0] === "orders" &&
      slug[1] === "capture" &&
      request.method.toUpperCase() === "POST"
    ) {
      logger.debug({ appId: appData._id }, "Capturing PayPal order");

      try {
        const body = await request.json();
        const { data, success, error } =
          captureOrderRequestSchema.safeParse(body);
        if (!success) {
          logger.error(
            { appId: appData._id, error },
            "Invalid capture order request data"
          );
          return Response.json({ success: false, error }, { status: 400 });
        }

        logger.debug(
          {
            appId: appData._id,
            orderId: data.orderId,
            paymentIntentId: data.paymentIntentId,
          },
          "Capturing PayPal order"
        );

        return await this.captureOrder(appData, data);
      } catch (error: any) {
        logger.error(
          { appId: appData._id, error: error?.message || error?.toString() },
          "Error capturing PayPal order"
        );
        throw error;
      }
    }

    logger.debug(
      { appId: appData._id, slug },
      "No matching PayPal app call handler found"
    );

    return undefined;
  }

  // protected getClient({
  //   data,
  //   token: dbToken,
  // }: Pick<ConnectedAppData, "data" | "token">): Client {
  //   const client = new Client({
  //     environment:
  //       process.env.PAYPAL_ENVIRONMENT?.toLocaleLowerCase() === "sandbox"
  //         ? Environment.Sandbox
  //         : Environment.Production,
  //     clientCredentialsAuthCredentials: {
  //       oAuthClientId: data.clientId,
  //       oAuthClientSecret: data.secretKey,

  //       oAuthOnTokenUpdate: (token: OAuthToken) => {
  //         // Add the callback handler to perform operations like save to DB or file etc.
  //         // It will be triggered whenever the token gets updated
  //         this.props.update({
  //           token,
  //         });
  //       },
  //       oAuthTokenProvider: (
  //         lastOAuthToken: OAuthToken | undefined,
  //         authManager: ClientCredentialsAuthManager
  //       ) => {
  //         // Add the callback handler to provide a new OAuth token
  //         // It will be triggered whenever the lastOAuthToken is undefined or expired
  //         return dbToken ?? authManager.fetchToken();
  //       },
  //     },
  //   });

  //   return client;
  // }

  public getFormProps(
    appData: ConnectedAppData<PaypalConfiguration>
  ): PaypalFormProps {
    if (!appData.data) throw new Error("Paypal app is not configured");
    const { secretKey, ...rest } = appData.data;

    return {
      ...rest,
      isSandbox: this.environment === Environment.Sandbox,
    };
  }

  protected async createOrder(
    appData: ConnectedAppData,
    request: CreateOrderRequest
  ) {
    const logger = this.loggerFactory("createOrder");
    logger.debug(
      { appId: appData._id, paymentIntentId: request.paymentIntentId },
      "Creating PayPal order"
    );

    try {
      const intent = await this.props.services
        .PaymentsService()
        .getIntent(request.paymentIntentId);

      if (!intent) {
        logger.error(
          { appId: appData._id, paymentIntentId: request.paymentIntentId },
          "Payment intent not found"
        );
        return Response.json({ error: "intent_not_found" }, { status: 400 });
      }

      logger.debug(
        {
          appId: appData._id,
          paymentIntentId: request.paymentIntentId,
          amount: intent.amount,
        },
        "Retrieved payment intent, creating PayPal order"
      );

      const client = this.getClient(appData);
      const ordersController = new OrdersController(client);
      const { result: order, ...httpResponse } =
        await ordersController.createOrder({
          body: {
            intent: CheckoutPaymentIntent.Capture,
            purchaseUnits: [
              {
                amount: {
                  currencyCode: "USD",
                  value: formatAmountString(intent.amount),
                },
              },
            ],
          },
        });

      if (httpResponse.statusCode >= 400) {
        logger.error(
          {
            appId: appData._id,
            paymentIntentId: request.paymentIntentId,
            statusCode: httpResponse.statusCode,
          },
          "Failed to create PayPal order"
        );
        return Response.json(
          { error: "create_order_failed" },
          { status: httpResponse.statusCode }
        );
      }

      logger.debug(
        {
          appId: appData._id,
          paymentIntentId: request.paymentIntentId,
          orderId: order.id,
        },
        "Successfully created PayPal order, updating payment intent"
      );

      await this.props.services.PaymentsService().updateIntent(intent._id, {
        externalId: order.id,
      });

      logger.info(
        {
          appId: appData._id,
          paymentIntentId: request.paymentIntentId,
          orderId: order.id,
        },
        "Successfully created PayPal order"
      );

      return Response.json(order);
    } catch (error: any) {
      logger.error(
        {
          appId: appData._id,
          paymentIntentId: request.paymentIntentId,
          error: error?.message || error?.toString(),
        },
        "Error creating PayPal order"
      );
      throw error;
    }
  }

  protected async captureOrder(
    appData: ConnectedAppData,
    request: CaptureOrderRequest
  ) {
    const logger = this.loggerFactory("captureOrder");
    logger.debug(
      {
        appId: appData._id,
        orderId: request.orderId,
        paymentIntentId: request.paymentIntentId,
      },
      "Capturing PayPal order"
    );

    try {
      const intent = await this.props.services
        .PaymentsService()
        .getIntentByExternalId(request.orderId);

      if (!intent) {
        logger.error(
          { appId: appData._id, orderId: request.orderId },
          "Payment intent not found by external ID"
        );
        return Response.json({ error: "intent_not_found" }, { status: 400 });
      }

      if (intent._id !== request.paymentIntentId) {
        logger.error(
          {
            appId: appData._id,
            orderId: request.orderId,
            intentId: intent._id,
            requestIntentId: request.paymentIntentId,
          },
          "Payment intent ID mismatch"
        );
        return Response.json({ error: "intent_id_not_match" }, { status: 400 });
      }

      logger.debug(
        {
          appId: appData._id,
          orderId: request.orderId,
          paymentIntentId: request.paymentIntentId,
        },
        "Retrieved payment intent, capturing PayPal order"
      );

      const client = this.getClient(appData);
      const ordersController = new OrdersController(client);
      const { result: order, ...httpResponse } =
        await ordersController.captureOrder({
          id: request.orderId,
        });

      if (httpResponse.statusCode >= 400) {
        logger.error(
          {
            appId: appData._id,
            orderId: request.orderId,
            statusCode: httpResponse.statusCode,
          },
          "Failed to capture PayPal order"
        );

        await this.props.services.PaymentsService().updateIntent(intent._id, {
          status: "failed",
        });

        return Response.json(
          { error: "capture_order_failed" },
          { status: httpResponse.statusCode }
        );
      }

      logger.debug(
        {
          appId: appData._id,
          orderId: request.orderId,
          paymentIntentId: request.paymentIntentId,
        },
        "Successfully captured PayPal order, updating payment intent status"
      );

      await this.props.services.PaymentsService().updateIntent(intent._id, {
        status: "paid",
      });

      logger.info(
        {
          appId: appData._id,
          orderId: request.orderId,
          paymentIntentId: request.paymentIntentId,
        },
        "Successfully captured PayPal order"
      );

      return Response.json(order);
    } catch (error: any) {
      logger.error(
        {
          appId: appData._id,
          orderId: request.orderId,
          paymentIntentId: request.paymentIntentId,
          error: error?.message || error?.toString(),
        },
        "Error capturing PayPal order"
      );
      throw error;
    }
  }

  public async refundPayment(
    appData: ConnectedAppData,
    payment: Payment
  ): Promise<{ success: boolean; error?: string }> {
    const logger = this.loggerFactory("refundPayment");
    logger.debug(
      {
        appId: appData._id,
        paymentId: payment._id,
        paymentType: payment.type,
        ...(payment.type === "online" && {
          appName: (payment as any).appName,
          externalId: (payment as any).externalId,
        }),
      },
      "Processing PayPal refund"
    );

    if (
      payment.type !== "online" ||
      (payment as any).appName !== PAYPAL_APP_NAME ||
      !(payment as any).externalId
    ) {
      logger.debug(
        { appId: appData._id, paymentId: payment._id },
        "Payment not supported for refund"
      );
      return { success: false, error: "not_supported" };
    }

    const externalId = (payment as any).externalId;

    try {
      logger.debug(
        { appId: appData._id, paymentId: payment._id, externalId },
        "Retrieving PayPal order for refund"
      );

      const client = this.getClient(appData);
      const ordersController = new OrdersController(client);
      const { result: order, ...httpResponse } =
        await ordersController.getOrder({
          id: externalId,
        });

      if (httpResponse.statusCode >= 400) {
        logger.error(
          {
            appId: appData._id,
            paymentId: payment._id,
            externalId,
            statusCode: httpResponse.statusCode,
          },
          "Failed to retrieve PayPal order for refund"
        );
        return {
          success: false,
          error: httpResponse.body.toString(),
        };
      }

      const captureId = order?.purchaseUnits?.[0].payments?.captures?.[0].id;
      if (!captureId) {
        logger.error(
          { appId: appData._id, paymentId: payment._id, externalId },
          "Failed to get capture ID from PayPal order"
        );
        return { success: false, error: "failed_to_get_capture_id" };
      }

      logger.debug(
        { appId: appData._id, paymentId: payment._id, captureId },
        "Processing PayPal refund with capture ID"
      );

      const paymentsController = new PaymentsController(client);
      const { result, ...refundHttpResponse } =
        await paymentsController.refundCapturedPayment({ captureId });

      if (refundHttpResponse.statusCode >= 400) {
        logger.error(
          {
            appId: appData._id,
            paymentId: payment._id,
            captureId,
            statusCode: refundHttpResponse.statusCode,
          },
          "Failed to refund PayPal payment"
        );
        return {
          success: false,
          error: refundHttpResponse.body.toString(),
        };
      }

      logger.info(
        { appId: appData._id, paymentId: payment._id, captureId },
        "Successfully refunded PayPal payment"
      );

      return { success: true };
    } catch (error: any) {
      logger.error(
        {
          appId: appData._id,
          paymentId: payment._id,
          error: error?.message || error?.toString(),
        },
        "Error processing PayPal refund"
      );
      throw error;
    }
  }

  protected async getSimplifiedClient({
    data,
    token: dbToken,
  }: Pick<
    ConnectedAppData<PaypalConfiguration>,
    "data" | "token"
  >): Promise<PaypalClient> {
    const logger = this.loggerFactory("getSimplifiedClient");
    logger.debug(
      { clientId: data?.clientId ? maskify(data.clientId) : undefined },
      "Creating simplified PayPal client"
    );

    if (!data) {
      logger.error("No PayPal configuration data provided");
      throw new Error("No data");
    }

    try {
      const { url } = await this.props.services
        .ConfigurationService()
        .getConfiguration("general");

      logger.debug(
        { clientId: maskify(data.clientId), url },
        "Created simplified PayPal client"
      );

      return new PaypalClient(data.clientId, data.secretKey, url);
    } catch (error: any) {
      logger.error(
        {
          clientId: maskify(data.clientId),
          error: error?.message || error?.toString(),
        },
        "Error creating simplified PayPal client"
      );
      throw error;
    }
  }

  protected getClient({
    data,
    token: dbToken,
  }: Pick<ConnectedAppData<PaypalConfiguration>, "data" | "token">) {
    const logger = this.loggerFactory("getClient");
    logger.debug(
      {
        clientId: data?.clientId ? maskify(data.clientId) : undefined,
        environment: this.environment,
      },
      "Creating PayPal client"
    );

    if (!data) {
      logger.error("No PayPal configuration data provided");
      throw new Error("No data");
    }

    logger.debug(
      { clientId: maskify(data.clientId), environment: this.environment },
      "Created PayPal client"
    );

    return new Client({
      environment: this.environment,
      clientCredentialsAuthCredentials: {
        oAuthClientId: data.clientId,
        oAuthClientSecret: data.secretKey,
        oAuthOnTokenUpdate: async (token) => {
          logger.debug(
            { clientId: maskify(data.clientId) },
            "Updating PayPal OAuth token"
          );
          await this.props.update({
            token,
          });
        },
        oAuthTokenProvider: (lastOAuthToken, authManager) => {
          logger.debug(
            { clientId: maskify(data.clientId), hasExistingToken: !!dbToken },
            "Providing PayPal OAuth token"
          );
          const oAuthToken = dbToken;
          if (oAuthToken != null && !authManager.isExpired(oAuthToken)) {
            logger.debug(
              { clientId: maskify(data.clientId) },
              "Using existing PayPal OAuth token"
            );
            return oAuthToken;
          }

          logger.debug(
            { clientId: maskify(data.clientId) },
            "Fetching new PayPal OAuth token"
          );
          return authManager.fetchToken();
        },
      },
    });
  }

  protected get environment() {
    return process.env.PAYPAL_ENV === "production"
      ? Environment.Production
      : process.env.NODE_ENV === "development"
        ? Environment.Sandbox
        : Environment.Production;
  }
}

export default PaypalConnectedApp;
