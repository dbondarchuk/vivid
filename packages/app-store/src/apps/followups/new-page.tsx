"use client";

import { ComplexAppSetupProps } from "@vivid/types";
import { FollowUpForm } from "./form";

export const NewFollowUpPage: React.FC<ComplexAppSetupProps> = ({ appId }) => {
  return <FollowUpForm appId={appId} />;
};
