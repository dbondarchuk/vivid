"use client";
import { SessionProvider, SessionProviderProps } from "next-auth/react";
import { NavigationGuardProvider } from "next-navigation-guard";
import React from "react";
import ThemeProvider from "./theme-toggle/theme-provider";

export default function Providers({
  session,
  children,
}: {
  session: SessionProviderProps["session"];
  children: React.ReactNode;
}) {
  return (
    <>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <SessionProvider session={session}>
          <NavigationGuardProvider>{children}</NavigationGuardProvider>
        </SessionProvider>
      </ThemeProvider>
    </>
  );
}
