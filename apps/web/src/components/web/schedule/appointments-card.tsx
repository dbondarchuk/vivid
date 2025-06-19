import { IWithI18nProps, withI18n } from "@/i18n/with-i18n";
import { AppointmentChoice } from "@vivid/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@vivid/ui";
import { durationToTime } from "@vivid/utils";
import { DollarSign, Timer } from "lucide-react";
import React from "react";
import { MdxContent } from "../mdx/mdx-content-client";
import { useI18n } from "@vivid/i18n";

export type AppointmentsCardProps = {
  options: AppointmentChoice[];
  className?: string;
  onSelect: (slug: string) => void;
};

export const AppointmentsCard: React.FC<AppointmentsCardProps> = ({
  options: meetings,
  className,
  onSelect,
}) => {
  const i18n = useI18n();

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
    <div className={className}>
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
            </CardHeader>
            <CardContent>
              <MdxContent source={option.description} />
              {/* <PlateStaticEditor value={option.description} /> */}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
