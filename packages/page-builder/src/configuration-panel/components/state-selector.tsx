import { BuilderKeys, useI18n } from "@vivid/i18n";
import {
  Button,
  Label,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Badge,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@vivid/ui";
import { Plus } from "lucide-react";
import React, { useState } from "react";
import {
  parentLevelKeys,
  State,
  states,
  StateWithParent,
} from "../../style/zod";

interface StateSelectorProps {
  states: StateWithParent[];
  onStatesChange: (states: StateWithParent[]) => void;
  styleName: string;
  variantIndex: number;
}

export const StateSelector: React.FC<StateSelectorProps> = ({
  states: currentStates,
  onStatesChange,
  styleName,
  variantIndex,
}) => {
  const t = useI18n("builder");
  const [isOpen, setIsOpen] = useState(false);
  const [newState, setNewState] = useState<State>("hover");
  const [newParentLevel, setNewParentLevel] = useState<number>(0);

  const addNewState = () => {
    const stateWithParent: StateWithParent = {
      state: newState,
      parentLevel: newParentLevel,
    };

    // Check if this combination already exists
    const exists = currentStates?.some(
      (s) => s.state === newState && s.parentLevel === newParentLevel
    );

    if (!exists) {
      const newStates = [...(currentStates || []), stateWithParent];
      onStatesChange(newStates);
    }

    // Reset form
    setNewState("hover");
    setNewParentLevel(0);
  };

  const removeState = (state: State, parentLevel: number) => {
    const newStates =
      currentStates?.filter(
        (s) => !(s.state === state && s.parentLevel === parentLevel)
      ) || [];
    onStatesChange(newStates);
  };

  const getStateLabel = (stateWithParent: StateWithParent) => {
    const stateLabel = t(
      `pageBuilder.styles.states.${stateWithParent.state}` as BuilderKeys
    );
    const parentLevel = stateWithParent.parentLevel || 0;
    const parentKey = parentLevelKeys[parentLevel];
    const parentLabel = parentKey
      ? t(`pageBuilder.styles.states.parentLevels.${parentKey}` as BuilderKeys)
      : "";
    return parentLevel === 0 ? stateLabel : `${parentLabel}:${stateLabel}`;
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="xs" className="w-full h-6 text-xs">
          {t("pageBuilder.styles.states.shortLabel", {
            count: currentStates?.length ?? 0,
          })}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          {/* Selected States Display */}
          {currentStates && currentStates.length > 0 && (
            <div className="space-y-2">
              <Label className="text-xs font-medium">
                {t("pageBuilder.styles.states.selectedStates")}
              </Label>
              <div className="flex flex-wrap gap-1">
                {currentStates.map((stateWithParent, index) => (
                  <Badge
                    key={`${stateWithParent.state}-${stateWithParent.parentLevel}-${index}`}
                    variant="secondary"
                    className="text-xs cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() =>
                      removeState(
                        stateWithParent.state,
                        stateWithParent.parentLevel || 0
                      )
                    }
                  >
                    {getStateLabel(stateWithParent)}
                    <span className="ml-1">×</span>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Add New State */}
          <div className="space-y-2 w-full">
            <Label className="text-xs font-medium">
              {t("pageBuilder.styles.states.addNewState")}
            </Label>
            <div className="flex flex-row items-center gap-1 w-full">
              <Select
                value={newParentLevel.toString()}
                onValueChange={(value) => setNewParentLevel(parseInt(value))}
              >
                <SelectTrigger size="xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {parentLevelKeys.map((key, index) => (
                    <SelectItem key={index} value={index.toString()}>
                      {t(`pageBuilder.styles.states.parentLevels.${key}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={newState}
                onValueChange={(value) => setNewState(value as State)}
              >
                <SelectTrigger size="xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {states.map((state) => (
                    <SelectItem key={state} value={state}>
                      {t(`pageBuilder.styles.states.${state}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                size="xs"
                onClick={addNewState}
                disabled={currentStates?.some(
                  (s) =>
                    s.state === newState && s.parentLevel === newParentLevel
                )}
                variant="ghost"
              >
                <Plus className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
