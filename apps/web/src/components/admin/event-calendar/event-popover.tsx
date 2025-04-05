import { Popover, PopoverContent, PopoverTrigger, cn } from "@vivid/ui";
import { durationToTime } from "@vivid/utils";
import { Clock, Timer } from "lucide-react";
import { DateTime } from "luxon";
import React from "react";
import { EventVariantClasses } from "./styles";
import { CalendarEvent } from "./types";

export type EventPopoverProps = {
  event: CalendarEvent;
  children: React.ReactNode;
};

export const EventPopover: React.FC<EventPopoverProps> = ({
  event,
  children,
}) => {
  const eventDate = DateTime.fromJSDate(event.start);
  const duration = durationToTime(
    DateTime.fromJSDate(event.end).diff(eventDate, "minutes").toObject()
      .minutes ?? 0
  );

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-3">
          <div
            className={cn(
              "h-1.5 rounded-full",
              EventVariantClasses[event.variant || "primary"] ??
                EventVariantClasses.primary
            )}
          />
          <div className="font-semibold text-lg">{event.title}</div>

          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="mr-2 h-4 w-4" />
            <span>{eventDate.toLocaleString(DateTime.DATETIME_FULL)}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Timer className="mr-2 h-4 w-4" />
            <span>
              {duration.hours} hr {duration.minutes} min
            </span>
          </div>

          {/* {event.location && (
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="mr-2 h-4 w-4" />
              <span>{event.location}</span>
            </div>
          )}

          {event.description && (
            <div className="pt-2 border-t text-sm">{event.description}</div>
          )} */}
        </div>
      </PopoverContent>
    </Popover>
  );
};
