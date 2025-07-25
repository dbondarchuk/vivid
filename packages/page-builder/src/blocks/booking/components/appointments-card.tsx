import { AppointmentChoice } from "@vivid/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Markdown,
} from "@vivid/ui";
import { durationToTime } from "@vivid/utils";
import { DollarSign, Timer } from "lucide-react";
import React from "react";
import { useI18n } from "@vivid/i18n";

export type AppointmentsCardProps = {
  options: AppointmentChoice[];
  className?: string;
  id?: string;
  onSelect: (slug: string) => void;
};

export const AppointmentsCard: React.FC<AppointmentsCardProps> = ({
  options: meetings,
  className,
  id,
  onSelect,
}) => {
  const i18n = useI18n("translation");

  const onKeyPress = React.useCallback(
    (id: string, event: React.KeyboardEvent<any>) => {
      if (event.key === "Enter" || event.key === " ") {
        onSelect(id);
        event.preventDefault();
      }
    },
    [onSelect]
  );

  return (
    <div className={className} id={id}>
      {meetings.map((option) => {
        return (
          <Card
            key={option._id}
            onClick={() => onSelect(option._id)}
            onKeyDown={(e) => onKeyPress(option._id, e)}
            className="cursor-pointer flex flex-col justify-between"
            tabIndex={1}
            aria-describedby={`option-${option._id}`}
            role="button"
          >
            <CardHeader id={`option-${option._id}`}>
              <div className="flex flex-col grow gap-2">
                <CardTitle>{option.name}</CardTitle>
                <CardDescription className="flex flex-col gap-2">
                  <div
                    className="flex flex-row items-center"
                    aria-label={
                      option.duration
                        ? i18n(
                            "form_duration_hour_minutes_label_format",
                            durationToTime(option.duration)
                          )
                        : i18n("custom_duration_label_format")
                    }
                  >
                    <Timer className="mr-1" />
                    {option.duration
                      ? i18n(
                          "duration_hour_min_format",
                          durationToTime(option.duration)
                        )
                      : i18n("duration_custom")}
                  </div>
                  {!!option.price && (
                    <div
                      className="flex flex-row items-center"
                      aria-label={i18n("form_price_label_format", {
                        price: option.price.toFixed(2).replace(/\.00$/, ""),
                      })}
                    >
                      <DollarSign className="mr-1" aria-label="" />
                      {option.price.toFixed(2).replace(/\.00$/, "")}
                    </div>
                  )}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <Markdown markdown={option.description} prose="simple" />
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
