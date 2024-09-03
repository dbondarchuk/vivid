import { Button } from "@/components/ui/button";
import { BaseCard, BaseCardProps } from "./baseCard";
import { ReactNode } from "react";
import { withI18n } from "@/i18n/withI18n";
import { AppointmentAddon } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Timer, DollarSign } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

export type AddonsCardProps = BaseCardProps & {
  onAddonSelectionChange: (addons: AppointmentAddon[]) => void;
};

class _AddonsCard extends BaseCard<AddonsCardProps> {
  public get isPrevDisabled(): boolean {
    return false;
  }

  public get isNextDisabled(): boolean {
    return false;
  }

  private onClick(option: AppointmentAddon): void {
    const index = (this.props.selectedAddons || []).findIndex(
      (addon) => addon.id === option.id
    );

    if (index < 0) {
      this.props.onAddonSelectionChange([
        ...(this.props.selectedAddons || []),
        option,
      ]);
    } else {
      this.props.onAddonSelectionChange([
        ...(this.props.selectedAddons || []).slice(0, index),
        ...(this.props.selectedAddons || []).slice(index + 1),
      ]);
    }
  }

  public get cardContent(): ReactNode {
    return (
      <div className="flex flex-col">
        <div className="text-center">
          <h2>{this.props.i18n("select_addons_label")}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {(this.props.appointmentOption.addons || []).map((option) => {
            return (
              <Card
                key={option.id}
                onClick={() => this.onClick(option)}
                className="cursor-pointer"
              >
                <CardHeader className="flex flex-row w-full">
                  <div className="flex flex-col grow">
                    <CardTitle className="mt-0">{option.name}</CardTitle>
                    <CardDescription className="flex flex-col gap-2">
                      <div className="flex flex-row items-center">
                        <Timer className="mr-1" />
                        {option.duration
                          ? this.props.i18n("duration_min_format", {
                              duration: option.duration,
                            })
                          : this.props.i18n("duration_custom")}
                      </div>
                      {option.price && (
                        <div className="flex flex-row items-center">
                          <DollarSign className="mr-1" />
                          {option.price.toFixed(2).replace(/\.00$/, "")}
                        </div>
                      )}
                    </CardDescription>
                  </div>
                  <div className="flex place-content-start">
                    <Checkbox
                      checked={this.props.selectedAddons?.some(
                        (addon) => addon.id === option.id
                      )}
                    />
                  </div>
                </CardHeader>
                <CardContent>{option.description}</CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }
}

export const AddonsCard = withI18n(_AddonsCard);
