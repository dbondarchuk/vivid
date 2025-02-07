"use client";

import { AvailableApps } from "@vivid/app-store";
import { AppSetupProps, ConnectedApp } from "@vivid/types";
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Spinner,
  useToast,
} from "@vivid/ui";
import { useRouter } from "next/navigation";
import React from "react";

export type AddOrUpdateAppButtonProps = {
  children: React.ReactNode;
} & (
  | {
      app: ConnectedApp;
    }
  | {
      appType: string;
    }
);

export const AddOrUpdateAppButton: React.FC<AddOrUpdateAppButtonProps> = ({
  children,
  ...props
}) => {
  const { toast } = useToast();
  const router = useRouter();

  let app: ConnectedApp | undefined = undefined;
  let appType: string;
  if ("app" in props) {
    app = props.app;
    appType = props.app.name;
  } else {
    appType = props.appType;
  }

  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const openDialog = () => {
    setIsOpen(true);
  };

  const closeDialog = (redirect?: boolean) => {
    setIsOpen(false);
    setIsLoading(false);
    if (app) {
      router.refresh();
    } else if (redirect) {
      router.push("/admin/dashboard/apps");
    }
  };

  const setupProps: AppSetupProps = {
    onSuccess: () => {
      toast({
        variant: "default",
        title: "Success!",
        description: "Your app was successfully connected",
      });

      closeDialog(true);
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
    appId: app?._id,
  };

  const AppSetupElement = React.useMemo(() => {
    if (!appType) return null;

    const app = AvailableApps[appType];
    if (app.type === "complex" || app.type === "system") return null;

    return app.SetUp(setupProps);
  }, [appType]);

  const onDialogOpenChange = (open: boolean) => {
    if (open) openDialog();
    else closeDialog();
  };

  const title = app ? "Update app" : "Connect new app";

  return (
    <Dialog open={isOpen} onOpenChange={onDialogOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-full sm:max-w-lg" aria-description={title}>
        <DialogHeader className="px-1">
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="w-full overflow-y-auto px-1">
          <div className="flex flex-col gap-4 py-4 relative w-full">
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
        </div>
        <DialogFooter className="px-1">
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
