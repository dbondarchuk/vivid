import { BuilderKeys, useI18n } from "@vivid/i18n";
import {
  Button,
  Label,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@vivid/ui";
import React from "react";
import { State } from "../../style/zod";

interface StateSelectorProps {
  states: State[];
  onStatesChange: (states: State[]) => void;
  styleName: string;
  variantIndex: number;
}

const availableStates: State[] = ["hover", "focus", "active", "disabled"];

export const StateSelector: React.FC<StateSelectorProps> = ({
  states: currentStates,
  onStatesChange,
  styleName,
  variantIndex,
}) => {
  const t = useI18n("builder");

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="xs" className="w-full h-6 text-xs">
          {t("pageBuilder.styles.states.shortLabel", {
            count: currentStates?.length ?? 0,
          })}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48">
        <div className="space-y-2">
          <Label className="text-xs">
            {t("pageBuilder.styles.states.title")}
          </Label>
          {availableStates.map((state) => (
            <div key={state} className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={`${styleName}-${variantIndex}-state-${state}`}
                checked={currentStates?.includes(state) || false}
                onChange={(e) => {
                  const current = currentStates || [];
                  const newStates = e.target.checked
                    ? [...current, state]
                    : current.filter((s) => s !== state);
                  onStatesChange(newStates.length > 0 ? newStates : []);
                }}
                className="h-3 w-3"
              />
              <Label
                htmlFor={`${styleName}-${variantIndex}-state-${state}`}
                className="text-xs cursor-pointer"
              >
                {t(`pageBuilder.styles.states.${state}` as BuilderKeys)}{" "}
                <span className="text-muted-foreground">:{state}</span>
              </Label>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};
