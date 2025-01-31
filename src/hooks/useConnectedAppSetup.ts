import { addNewApp, getAppData, processRequest } from "@/apps/apps.actions";
import { useToast } from "@/components/ui/use-toast";
import { ConnectedAppStatusWithText } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { FieldValues, useForm } from "react-hook-form";
import { ZodType } from "zod";

export type UseConnectedAppSetupProps<T extends FieldValues> = {
  appId?: string;
  appName: string;
  schema: ZodType;
  successText?: string;
  errorText?: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
};

export function useConnectedAppSetup<T extends FieldValues>({
  appId: existingAppId,
  appName,
  schema,
  successText = "Your app was successfully connected",
  errorText = "The request to connect the app has failed. Please try again.",
  onSuccess,
  onError,
}: UseConnectedAppSetupProps<T>) {
  const { toast } = useToast();

  const [appId, setAppId] = React.useState<string>();
  const [isLoading, setIsLoading] = React.useState(false);
  const [appStatus, setAppStatus] =
    React.useState<ConnectedAppStatusWithText>();

  const [initialAppData, setInitialAppData] = React.useState<T>();
  React.useEffect(() => {
    if (!existingAppId) return;

    const getInitialData = async () => {
      const data = await getAppData(existingAppId);
      setInitialAppData(data);
    };

    setAppId(existingAppId);
    getInitialData();
  }, [existingAppId]);

  const form = useForm<T>({
    resolver: zodResolver(schema),
    mode: "all",
    values: initialAppData,
  });

  const onSubmit = async (data: T) => {
    try {
      setIsLoading(true);

      const _appId = appId || (await addNewApp(appName));
      setAppId(_appId);

      const status = (await processRequest(
        _appId,
        data
      )) as ConnectedAppStatusWithText;

      setAppStatus(status);

      if (status.status === "connected") {
        toast({
          variant: "default",
          title: "Success!",
          description: successText,
        });
        onSuccess?.();
      } else if (status.status === "failed") {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: errorText,
        });

        onError?.(status.statusText);
      }
    } catch (e: any) {
      onError?.(e?.message);
    } finally {
      setIsLoading(false);
    }
  };

  const { isValid } = form.formState;

  return {
    isLoading,
    setIsLoading,
    form,
    isValid,
    appStatus,
    onSubmit,
  };
}
