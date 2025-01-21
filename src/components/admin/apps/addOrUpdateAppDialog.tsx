"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { AppSetupProps, ConnectedApp } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import { Spinner } from "@/components/ui/spinner";
import { InstalledApps } from "@/apps";

export type AddOrUpdateAppButtonProps = {
  app?: ConnectedApp;
  children: React.ReactNode;
};

export const AddOrUpdateAppButton: React.FC<AddOrUpdateAppButtonProps> = ({
  app,
  children,
}) => {
  const { toast } = useToast();
  const router = useRouter();

  const [appType, setAppType] = React.useState<string>();
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const openDialog = () => {
    setIsOpen(true);
    setAppType(app?.name);
  };

  const closeDialog = () => {
    setIsOpen(false);
    setIsLoading(false);
    setAppType(undefined);
    router.refresh();
  };

  const setupProps: AppSetupProps = {
    setIsLoading: setIsLoading,
    onSuccess: () => {
      toast({
        variant: "default",
        title: "Success!",
        description: "Your app was successfully connected",
      });

      closeDialog();
    },
    onError: (error: string) => {
      console.error(`Failed to set up app: ${error}`);

      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description:
          "The request to connect the app has failed. Please try again.",
      });
    },
    onStatusChange(status, statusText) {},
    appId: app?._id,
  };

  const AppSetupElement = React.useMemo(() => {
    if (!appType) return null;

    return InstalledApps[appType].SetUp(setupProps);
  }, [appType]);

  const onDialogOpenChange = (open: boolean) => {
    if (open) openDialog();
    else closeDialog();
  };

  const title = app ? "Update app" : "Connect new app";

  return (
    <Dialog open={isOpen} onOpenChange={onDialogOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]" aria-description={title}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4 relative">
          <div className="grid grid-cols-4 items-center gap-4 w-full">
            <Label htmlFor="type">Select app</Label>
            <div className="col-span-3">
              <Select
                onValueChange={setAppType}
                disabled={!!app}
                value={app?.name}
              >
                <SelectTrigger id="type" className="w-full">
                  <SelectValue placeholder="Select app type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {Object.entries(InstalledApps).map(([type, App]) => (
                      <SelectItem value={type} key={type}>
                        <span className="inline-flex items-center gap-2">
                          <App.Logo /> {App.displayName}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          {AppSetupElement}
          {isLoading && (
            <div className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-white opacity-50">
              <div role="status">
                <Spinner className="w-20 h-20" />
                <span className="sr-only">Please wait...</span>
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
