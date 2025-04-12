"use client";

import { ComplexAppSetupProps } from "@vivid/types";
import React from "react";
import { BusyEventsForm } from "./components/form";

export const BusyEventsAppSetup: React.FC<ComplexAppSetupProps> = ({
  appId,
}) => {
  return <BusyEventsForm appId={appId} />;
};
