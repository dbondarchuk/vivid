import type {
  AppointmentAddon,
  AppointmentChoice,
  AppointmentOption,
  Fields,
  FieldsWithId,
  WithId,
  WithLabelFieldData,
} from "@/types";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IWithI18nProps } from "@/i18n/withI18n";
import { DollarSign, Timer } from "lucide-react";
import React from "react";
import { Markdown } from "../markdown/Markdown";

export type BaseCardProps = IWithI18nProps & {
  next?: () => void;
  prev?: () => void;

  appointmentOption: AppointmentChoice;
  selectedAddons?: AppointmentAddon[];
};

export type BaseCardState = {};

export abstract class BaseCard<
  P extends BaseCardProps = BaseCardProps,
  S extends BaseCardState = BaseCardState
> extends React.Component<P, S> {
  public abstract get isPrevDisabled(): boolean;
  public abstract get isNextDisabled(): boolean;

  public abstract get cardContent(): React.ReactNode;

  protected get duration() {
    if (!this.props.appointmentOption.duration) return undefined;

    return (
      this.props.appointmentOption.duration +
      (this.props.selectedAddons || []).reduce(
        (sum, addon) => sum + (addon.duration || 0),
        0
      )
    );
  }

  protected get price() {
    return (
      (this.props.appointmentOption.price || 0) +
      (this.props.selectedAddons || []).reduce(
        (sum, addon) => sum + (addon.price || 0),
        0
      )
    );
  }

  public render(): React.ReactNode {
    return (
      <Card className="sm:min-w-min md:w-full">
        <CardHeader className="text-center">
          <CardTitle>{this.props.appointmentOption.name}</CardTitle>
          {(this.duration || this.price) && (
            <CardDescription className="flex flex-row gap-2 justify-center place-items-center">
              {this.duration && (
                <div className="flex flex-row items-center">
                  <Timer className="mr-1" />
                  {this.props.i18n("duration_min_format", {
                    duration: this.duration,
                  })}
                </div>
              )}
              {this.price && (
                <div className="flex flex-row items-center">
                  <DollarSign className="mr-1" />
                  {this.price.toFixed(2).replace(/\.00$/, "")}
                </div>
              )}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>{this.cardContent}</CardContent>
        <CardFooter className="w-100 flex justify-between">
          <div>
            {this.props.prev && (
              <Button
                variant={"outline"}
                disabled={this.isPrevDisabled}
                onClick={() => this.props.prev?.()}
              >
                {this.props.i18n("back_button")}
              </Button>
            )}
          </div>
          <div>
            {this.props.next && (
              <Button
                variant={"outline"}
                disabled={this.isNextDisabled}
                onClick={() => this.props.next?.()}
              >
                {this.props.i18n("next_button")}
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    );
  }
}
