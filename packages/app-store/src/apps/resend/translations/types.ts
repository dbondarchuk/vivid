import { AllKeys } from "@hacado/i18n";
import { Leaves } from "@hacado/types";
import { RESEND_APP_NAME } from "../const";
import type admin from "./en/admin.generated";

export type ResendAdminKeys = Leaves<typeof admin>;
export const resendAdminNamespace = `app_${RESEND_APP_NAME}_admin` as const;

export type ResendAdminNamespace = typeof resendAdminNamespace;

export type ResendAdminAllKeys = AllKeys<ResendAdminNamespace, ResendAdminKeys>;
