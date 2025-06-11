"use client";

import { Badge, toast } from "@vivid/ui";
import { useRouter } from "next/navigation";
import React from "react";
import { create } from "zustand";

export type PendingAppointmentsContextProps = {
  count: number;
  setCount: (count: number) => void;
};

export const usePendingAppointmentsStore =
  create<PendingAppointmentsContextProps>((set) => ({
    count: 0,
    setCount: (count) => {
      return set(() => ({
        count,
      }));
    },
  }));

export const PendingAppointmentsBadge: React.FC = () => {
  const { count } = usePendingAppointmentsStore();
  return (
    <Badge variant="default" className="ml-1 px-2 scale-75 -translate-y-1">
      {count > 9 ? `9+` : count}
    </Badge>
  );
};

export const PendingAppointmentsToastStream: React.FC = () => {
  const { count, setCount } = usePendingAppointmentsStore();

  const router = useRouter();

  React.useEffect(() => {
    // Create an EventSource to listen to SSE events
    const eventSource = new EventSource("/admin/api/events/pending");
    // Handle incoming messages
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setCount(data);
    };

    // Handle errors
    eventSource.onerror = () => {
      console.error("Error connecting to SSE server.");
      eventSource.close();
    };

    // Cleanup on unmount
    return () => {
      eventSource.close();
    };
  }, []);

  React.useEffect(() => {
    if (count > 0) {
      toast(`You have ${count} pending appointment(s)`, {
        action: {
          label: "View",
          onClick: () => {
            router.push(
              `/admin/dashboard?activeTab=appointments&key=${Date.now()}`
            );
          },
        },
      });
    }
  }, [count]);

  return null;
};
