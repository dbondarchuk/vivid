import { InfoTooltip } from "@/components/admin/tooltip/infoTooltip";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { CalendarSourceConfiguration, ConnectedApp } from "@/types";
import { Copy, Trash } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
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
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { AvailableApps } from "@/apps";
import React from "react";
import { AppSelector } from "@/components/admin/apps/appSelector";

export type CalendarSourceCardProps = {
  item: CalendarSourceConfiguration;
  name: string;
  form: UseFormReturn<any>;
  disabled?: boolean;
  remove: () => void;
  update: (newValue: CalendarSourceConfiguration) => void;
  clone: () => void;
  apps: ConnectedApp[];
};

export const CalendarSourceCard: React.FC<CalendarSourceCardProps> = ({
  item,
  name,
  form,
  disabled,
  remove,
  update,
  clone,
  apps,
}) => {
  const appId = item.appId;
  const changeAppId = (value: typeof appId) => {
    const newValue = {
      ...form.getValues(name),
      appId: value,
    };
    update(newValue);
  };

  const appName = apps.find((app) => app._id === appId)?.name;
  const appDisplayName = appName ? AvailableApps[appName].displayName : null;

  return (
    <Card>
      <CardHeader className="justify-between relative flex flex-row items-center border-b-2 border-secondary px-3 py-3 w-full">
        <div className="hidden md:block">&nbsp;</div>
        <span
          className={cn("w-full text-center", !appName && "text-destructive")}
        >
          {appDisplayName || "Invalid calendar source"}
        </span>
        <div className="flex flex-row gap-2">
          <Button
            disabled={disabled}
            variant="outline"
            className=""
            size="sm"
            type="button"
            title="Clone"
            onClick={clone}
          >
            <Copy size={20} />
          </Button>
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
      </CardHeader>
      <CardContent className="px-3 pb-6 pt-3 text-left flex flex-col relative gap-4">
        <div className="grid md:grid-cols-1 gap-4">
          <FormField
            control={form.control}
            name={`${name}.appId`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  App <InfoTooltip>Select supported app</InfoTooltip>
                </FormLabel>

                <FormControl>
                  <AppSelector
                    disabled={disabled}
                    className="w-full"
                    scope="calendar-read"
                    apps={apps}
                    value={field.value}
                    onItemSelect={(value) => {
                      field.onChange(value);
                      changeAppId(value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
};
