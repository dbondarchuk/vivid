import {
  CheckoutPaymentIntent,
  Client,
  Environment,
  OrdersController,
  PaymentsController,
} from "@paypal/paypal-server-sdk";
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
  public constructor(protected readonly props: IConnectedAppProps) {}

  public async processRequest(
    appData: ConnectedAppData,
    data: PaypalConfiguration
  ): Promise<ConnectedAppStatusWithText> {
    try {
      if (!paypalConfigurationSchema.safeParse(data).success) {
        throw new Error("Bad data");
      }

      const client = await this.getSimplifiedClient({ data });
      await client.getAccessToken();

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

      return status;
    } catch (e: any) {
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
    if (
      slug.length === 1 &&
      slug[0] === "orders" &&
      request.method.toUpperCase() === "POST"
    ) {
      console.log("Creating order...");
      const body = await request.json();
      const { data, success, error } = createOrderRequestSchema.safeParse(body);
      if (!success) {
        return Response.json({ success: false, error }, { status: 400 });
      }

      return await this.createOrder(appData, data);
    } else if (
      slug.length === 2 &&
      slug[0] === "orders" &&
      slug[1] === "capture" &&
      request.method.toUpperCase() === "POST"
    ) {
      console.log("Capturing order...");
      const body = await request.json();
      const { data, success, error } =
        captureOrderRequestSchema.safeParse(body);
      if (!success) {
        return Response.json({ success: false, error }, { status: 400 });
      }

      return await this.captureOrder(appData, data);
    }

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
    const intent = await this.props.services
      .PaymentsService()
      .getIntent(request.paymentIntentId);
    if (!intent)
      return Response.json({ error: "intent_not_found" }, { status: 400 });

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
      return Response.json(
        { error: "create_order_failed" },
        { status: httpResponse.statusCode }
      );
    }

    await this.props.services.PaymentsService().updateIntent(intent._id, {
      externalId: order.id,
    });

    return Response.json(order);
  }

  protected async captureOrder(
    appData: ConnectedAppData,
    request: CaptureOrderRequest
  ) {
    const intent = await this.props.services
      .PaymentsService()
      .getIntentByExternalId(request.orderId);
    if (!intent) {
      return Response.json({ error: "intent_not_found" }, { status: 400 });
    }

    if (intent._id !== request.paymentIntentId) {
      return Response.json({ error: "intent_id_not_match" }, { status: 400 });
    }

    const client = this.getClient(appData);
    const ordersController = new OrdersController(client);
    const { result: order, ...httpResponse } =
      await ordersController.captureOrder({
        id: request.orderId,
      });

    if (httpResponse.statusCode >= 400) {
      await this.props.services.PaymentsService().updateIntent(intent._id, {
        status: "failed",
      });

      return Response.json(
        { error: "capture_order_failed" },
        { status: httpResponse.statusCode }
      );
    }

    await this.props.services.PaymentsService().updateIntent(intent._id, {
      status: "paid",
    });

    return Response.json(order);
  }

  public async refundPayment(
    appData: ConnectedAppData,
    payment: Payment
  ): Promise<{ success: boolean; error?: string }> {
    if (
      payment.type !== "online" ||
      payment.appName !== PAYPAL_APP_NAME ||
      !payment.externalId
    ) {
      return { success: false, error: "not_supported" };
    }

    const client = this.getClient(appData);
    const ordersController = new OrdersController(client);
    const { result: order, ...httpResponse } = await ordersController.getOrder({
      id: payment.externalId,
    });

    if (httpResponse.statusCode >= 400) {
      return {
        success: false,
        error: httpResponse.body.toString(),
      };
    }

    const captureId = order?.purchaseUnits?.[0].payments?.captures?.[0].id;
    if (!captureId) {
      return { success: false, error: "failed_to_get_capture_id" };
    }

    const paymentsController = new PaymentsController(client);
    const { result, ...refundHttpResponse } =
      await paymentsController.refundCapturedPayment({ captureId });
    if (refundHttpResponse.statusCode >= 400) {
      return {
        success: false,
        error: refundHttpResponse.body.toString(),
      };
    }

    return { success: true };
  }

  protected async getSimplifiedClient({
    data,
    token: dbToken,
  }: Pick<
    ConnectedAppData<PaypalConfiguration>,
    "data" | "token"
  >): Promise<PaypalClient> {
    if (!data) throw new Error("No data");
    const { url } = await this.props.services
      .ConfigurationService()
      .getConfiguration("general");
    return new PaypalClient(data.clientId, data.secretKey, url);
  }

  protected getClient({
    data,
    token: dbToken,
  }: Pick<ConnectedAppData<PaypalConfiguration>, "data" | "token">) {
    if (!data) throw new Error("No data");
    return new Client({
      environment: this.environment,
      clientCredentialsAuthCredentials: {
        oAuthClientId: data.clientId,
        oAuthClientSecret: data.secretKey,
        oAuthOnTokenUpdate: async (token) => {
          await this.props.update({
            token,
          });
        },
        oAuthTokenProvider: (lastOAuthToken, authManager) => {
          const oAuthToken = dbToken;
          if (oAuthToken != null && !authManager.isExpired(oAuthToken)) {
            return oAuthToken;
          }

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
