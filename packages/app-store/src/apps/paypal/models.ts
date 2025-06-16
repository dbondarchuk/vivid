import { z } from "zod";

export const paypalButtonsShape = ["rect", "pill", "sharp"] as const;
export const paypalButtonLayout = ["vertical", "horizontal"] as const;
export const paypalButtonColor = [
  "gold",
  "blue",
  "silver",
  "white",
  "black",
] as const;
export const paypalButtonLabel = ["paypal", "pay"] as const;

export const paypalConfigurationSchema = z.object({
  clientId: z.string().min(1, "Paypal Client ID is required"),
  secretKey: z.string().min(1, "Paypal API key is required"),
  buttonStyle: z.object({
    shape: z.enum(paypalButtonsShape, { message: "Unknown shape" }),
    layout: z.enum(paypalButtonLayout, { message: "Unknow layout" }),
    color: z.enum(paypalButtonColor, { message: "Unknow color" }),
    label: z.enum(paypalButtonLabel, { message: "Unknown label" }),
  }),
});

export type PaypalConfiguration = z.infer<typeof paypalConfigurationSchema>;

export type PaypalFormProps = Omit<PaypalConfiguration, "secretKey"> & {
  isSandbox: boolean;
};

export const createOrderRequestSchema = z.object({
  paymentIntentId: z.string().min(1, "Payment intent ID is required"),
});

export type CreateOrderRequest = z.infer<typeof createOrderRequestSchema>;

export const captureOrderRequestSchema = z.object({
  orderId: z.string().min(1, "Order ID is required"),
  paymentIntentId: z.string().min(1, "Payment intent ID is required"),
});

export type CaptureOrderRequest = z.infer<typeof captureOrderRequestSchema>;
