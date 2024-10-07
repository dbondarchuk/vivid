"use client";

import { Link } from "@/components/ui/link";
import { ToastAction } from "@/components/ui/toast";
import { toast } from "@/components/ui/use-toast";
import React from "react";

export const PendingAppointmentsToast: React.FC<{
  pendingAppointmentsCount: number;
}> = ({ pendingAppointmentsCount }) => {
  React.useEffect(() => {
    if (pendingAppointmentsCount > 0) {
      toast({
        variant: "default",
        title: "Pending appointments",
        description: `You have ${pendingAppointmentsCount} pending appointments`,
        action: (
          <ToastAction altText="View pending appointment" asChild>
            <Link
              button
              variant="outline"
              href="/admin/dashboard?activeTab=appointments"
            >
              View
            </Link>
          </ToastAction>
        ),
      });
    }
  }, [pendingAppointmentsCount]);

  return null;
};
