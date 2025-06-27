import { UserAuthForm } from "@/components/admin/forms/user-auth-form";
import { ServicesContainer } from "@vivid/services";
import { buttonVariants, cn } from "@vivid/ui";
import { getLoggerFactory } from "@vivid/logger";
import { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AuthResult } from "../../auth";
import { redirect } from "next/navigation";
import { getI18nAsync } from "@vivid/i18n/server";

export const metadata: Metadata = {
  title: "Authentication",
  description: "Sign in",
};

export default async function AuthenticationPage() {
  const logger = getLoggerFactory("AdminPages")("signin");

  logger.debug("Loading signin page");

  const session = await AuthResult.auth();
  const t = await getI18nAsync("admin");

  if (session) {
    redirect("/admin/dashboard");
  }

  const general =
    await ServicesContainer.ConfigurationService().getConfiguration("general");

  logger.debug(
    {
      businessName: general.name,
    },
    "Signin page loaded"
  );

  return (
    <div className="relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <Link
        href="/admin/auth/signin"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute right-4 top-4 hidden md:right-8 md:top-8"
        )}
      >
        {t("auth.signIn")}
      </Link>
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 h-6 w-6"
          >
            <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
          </svg>
          {general.name}
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">&ldquo;{t("auth.quote")}&rdquo;</p>
            <footer className="text-sm">{t("auth.quoteAuthor")}</footer>
          </blockquote>
        </div>
      </div>
      <div className="flex h-full items-center p-4 lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              {t("auth.signIn")}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t("auth.signInDescription")}
            </p>
          </div>
          <Suspense>
            <UserAuthForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
