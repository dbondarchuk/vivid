import { InfoTooltip } from "@/components/admin/tooltip/infoTooltip";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Combobox, IComboboxItem } from "@/components/ui/combobox";
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
import { InstalledApps } from "@/apps";
import React from "react";
import { appStatusText, appStatusTextClasses } from "@/apps/apps.const";

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

const AppShortLabel: React.FC<{ app: ConnectedApp }> = ({ app }) => {
  const App = InstalledApps[app.name];
  return (
    <span className="inline-flex items-center gap-2">
      <App.Logo /> {App.displayName}{" "}
      {app.account?.username && (
        <span className="text-sm text-muted-foreground">
          ({app.account?.username})
        </span>
      )}
    </span>
  );
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
  const supportedApps = apps.filter(
    (app) => InstalledApps[app.name]?.scope.indexOf("calendar-read") >= 0
  );

  const appValues = (apps: ConnectedApp[]): IComboboxItem[] =>
    apps.map((app) => {
      return {
        value: app._id,
        shortLabel: <AppShortLabel app={app} />,
        label: (
          <div className="flex flex-col gap-2">
            <AppShortLabel app={app} />
            <div className={cn("text-sm", appStatusTextClasses[app.status])}>
              Status: {appStatusText[app.status]}, {app.statusText}
            </div>
          </div>
        ),
      };
    });

  const appId = item.appId;
  const changeAppId = (value: typeof appId) => {
    const newValue = {
      ...form.getValues(name),
      appId: value,
    };
    update(newValue);
  };

  const appName = supportedApps.find((app) => app._id === appId)?.name;
  const appDisplayName = appName ? InstalledApps[appName].displayName : null;

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
                  <Combobox
                    disabled={disabled}
                    className="flex w-full font-normal text-base"
                    values={appValues(supportedApps)}
                    searchLabel="Select app"
                    value={field.value}
                    customSearch={(search) =>
                      appValues(
                        supportedApps.filter(
                          (app) =>
                            app.name
                              .toLocaleLowerCase()
                              .includes(search.toLocaleLowerCase()) ||
                            app.account?.username
                              .toLocaleLowerCase()
                              .includes(search.toLocaleLowerCase())
                        )
                      )
                    }
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
