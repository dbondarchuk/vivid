import type { Language } from "@vivid/i18n";
import "next-auth";
import type { DefaultSession, User } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: User & {
      language: Language;
    } & DefaultSession["user"];
  }
}
