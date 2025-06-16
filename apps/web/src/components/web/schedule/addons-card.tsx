import { useI18n } from "@/i18n/i18n";
import { AppointmentAddon } from "@vivid/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Checkbox,
} from "@vivid/ui";
import { durationToTime } from "@vivid/utils";
import { DollarSign, Timer } from "lucide-react";
import React from "react";
import { MdxContent } from "../mdx/mdx-content-client";
import { useScheduleContext } from "./context";

export const AddonsCard: React.FC = () => {
  const i18n = useI18n();
  const { appointmentOption, setSelectedAddons, selectedAddons, setDiscount } =
    useScheduleContext();

  const onClick = (option: AppointmentAddon): void => {
    const index = (selectedAddons || []).findIndex(
      (addon) => addon._id === option._id
    );

    if (index < 0) {
      setSelectedAddons([...(selectedAddons || []), option]);
    } else {
      setSelectedAddons([
        ...(selectedAddons || []).slice(0, index),
        ...(selectedAddons || []).slice(index + 1),
      ]);
    }

    setDiscount(undefined);
  };

  return (
    <div className="flex flex-col">
      <div className="text-center">
        <h2>{i18n("select_addons_label")}</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {(appointmentOption.addons || []).map((addon) => {
          return (
            <Card
              key={addon._id}
              onClick={() => onClick(addon)}
              className="cursor-pointer flex flex-col justify-between"
            >
              <CardHeader
                className="flex flex-row w-full"
                id={`addon-${addon._id}`}
              >
                <div className="flex flex-col grow">
                  <CardTitle className="mt-0">{addon.name}</CardTitle>
                  <CardDescription className="flex flex-col gap-2">
                    {addon.duration && (
                      <div
                        className="flex flex-row items-center"
                        aria-label={i18n(
                          "form_duration_hour_minutes_label_format",
                          durationToTime(addon.duration)
                        )}
                      >
                        <Timer className="mr-1" />
                        {i18n(
                          "duration_hour_min_format",
                          durationToTime(addon.duration)
                        )}
                      </div>
                    )}
                    {addon.price && (
                      <div
                        className="flex flex-row items-center"
                        aria-label={i18n("form_price_label_format", {
                          price: addon.price.toFixed(2).replace(/\.00$/, ""),
                        })}
                      >
                        <DollarSign className="mr-1" />
                        {addon.price.toFixed(2).replace(/\.00$/, "")}
                      </div>
                    )}
                  </CardDescription>
                </div>
                <div className="flex place-content-start">
                  <Checkbox
                    aria-describedby={`addon-${addon._id}`}
                    checked={selectedAddons?.some((a) => a._id === addon._id)}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <MdxContent source={addon.description} />
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
