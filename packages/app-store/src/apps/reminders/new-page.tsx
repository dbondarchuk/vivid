"use client";

import { ComplexAppSetupProps } from "@vivid/types";
import { ReminderForm } from "./form";

export const NewReminderPage: React.FC<ComplexAppSetupProps> = ({ appId }) => {
  return <ReminderForm appId={appId} />;
};
