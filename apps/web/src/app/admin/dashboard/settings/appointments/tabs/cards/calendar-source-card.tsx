import { AvailableApps } from "@vivid/app-store";
import { CalendarSourceConfiguration, ConnectedApp } from "@vivid/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AppSelector,
  Button,
  Card,
  CardContent,
  CardHeader,
  cn,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  InfoTooltip,
} from "@vivid/ui";
import { Copy, Trash } from "lucide-react";
import React from "react";
import { UseFormReturn } from "react-hook-form";

export type CalendarSourceCardProps = {
  item: CalendarSourceConfiguration;
  name: string;
  form: UseFormReturn<any>;
  disabled?: boolean;
  excludeIds?: string[];
  remove: () => void;
  update: (newValue: CalendarSourceConfiguration) => void;
  clone: () => void;
};

export const CalendarSourceCard: React.FC<CalendarSourceCardProps> = ({
  item,
  name,
  form,
  disabled,
  excludeIds,
  remove,
  update,
  clone,
}) => {
  const [appName, setAppName] = React.useState<string | undefined>();

  const appId = item.appId;
  const changeAppId = (value: typeof appId) => {
    const newValue = {
      ...form.getValues(name),
      appId: value,
    };
    update(newValue);
  };

  const appDisplayName = appName ? AvailableApps[appName].displayName : null;

  return (
    <div className="flex flex-row gap-2 px-2 py-4 bg-background rounded w-full">
      <div className="grid grid-cols-1 gap-2 w-full relative">
        <FormField
          control={form.control}
          name={`${name}.appId`}
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>
                App <InfoTooltip>Select supported app</InfoTooltip>
              </FormLabel>

              <FormControl>
                <AppSelector
                  disabled={disabled}
                  className="w-full [&>button]:w-full"
                  scope="calendar-read"
                  value={field.value}
                  onItemSelect={(value) => {
                    field.onChange(value);
                    changeAppId(value);
                  }}
                  setAppName={setAppName}
                  excludeIds={excludeIds}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="flex flex-row items-center">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              disabled={disabled}
              variant="destructive"
              className=""
              size="sm"
              type="button"
              title="Remove"
            >
              <Trash size={20} />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                <p>Are you sure you want to remove this calendar soure?</p>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction asChild>
                <Button variant="destructive" onClick={remove}>
                  Delete
                </Button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};
