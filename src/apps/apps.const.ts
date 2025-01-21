import { ConnectedAppStatus } from "@/types";

export const appStatusText: Record<ConnectedAppStatus, string> = {
  connected: "Connected",
  failed: "Connection failed",
  pending: "Pending",
};

export const appStatusTextClasses: Record<ConnectedAppStatus, string> = {
  connected: "text-green-500",
  failed: "text-red-500",
  pending: "text-yellow-500",
};
