"use client";

import { Link, toast } from "@vivid/ui";
import React from "react";

export const PendingAppointmentsToast: React.FC<{
  pendingAppointmentsCount: number;
}> = ({ pendingAppointmentsCount }) => {
  React.useEffect(() => {
    if (pendingAppointmentsCount > 0) {
      toast(`You have ${pendingAppointmentsCount} pending appointments`, {
        action: (
          <Link
            button
            variant="outline"
            href="/admin/dashboard?activeTab=appointments"
          >
            View
          </Link>
        ),
      });
    }
  }, [pendingAppointmentsCount]);

  return null;
};
