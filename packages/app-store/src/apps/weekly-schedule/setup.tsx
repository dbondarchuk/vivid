"use client";

import { ComplexAppSetupProps } from "@vivid/types";
import React from "react";
import { WeeklyScheduleForm } from "./components/form";

export const WeeklyScheduleAppSetup: React.FC<ComplexAppSetupProps> = ({
  appId,
}) => {
  return <WeeklyScheduleForm appId={appId} />;
};
