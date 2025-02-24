"use client";

import { Link, toast } from "@vivid/ui";
import { useRouter } from "next/navigation";
import React from "react";

export const PendingAppointmentsToastStream: React.FC = () => {
  const [count, setCount] = React.useState(0);

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
            router.push("/admin/dashboard?activeTab=appointments");
            router.refresh();
          },
        },
      });
    }
  }, [count]);

  return null;
};
