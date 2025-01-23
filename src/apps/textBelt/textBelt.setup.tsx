"use client";

import { AppSetupProps, ConnectedAppStatusWithText } from "@/types";
import React from "react";
import {
  addNewApp,
  getAppData,
  getDemoArguments,
  processRequest,
} from "../apps.actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { appStatusText, appStatusTextClasses } from "../apps.const";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { InfoTooltip } from "@/components/admin/tooltip/infoTooltip";
import { TextBeltApp } from "./textBelt.app";
import {
  TextBeltConfiguration,
  textBeltConfigurationSchema,
} from "./textBelt.models";
import { Textarea } from "@/components/ui/textarea";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { templateSafeWithError } from "@/lib/string";
import {
  ConnectedAppNameAndLogo,
  ConnectedAppStatusMessage,
} from "@/components/admin/apps/connectedAppProperties";

export const TextBeltAppSetup: React.FC<AppSetupProps> = ({
  onSuccess,
  setIsLoading,
  onError,
  onStatusChange,
  appId: existingAppId,
}) => {
  const [appId, setAppId] = React.useState<string>();
  const [demoArguments, setDemoArguments] = React.useState<any>({});

  React.useEffect(() => {
    getDemoArguments().then((args) => setDemoArguments(args));
  }, []);

  const [initialAppData, setInitialAppData] =
    React.useState<TextBeltConfiguration>();
  React.useEffect(() => {
    if (!existingAppId) return;

    const getInitialData = async () => {
      const data = await getAppData(existingAppId);
      setInitialAppData(data);
    };

    setAppId(existingAppId);
    getInitialData();
  }, [existingAppId]);

  const [appStatus, setAppStatus] =
    React.useState<ConnectedAppStatusWithText>();

  const form = useForm<TextBeltConfiguration>({
    resolver: zodResolver(textBeltConfigurationSchema),
    mode: "all",
    values: initialAppData,
  });

  const createApp = async (data: TextBeltConfiguration) => {
    try {
      setIsLoading(true);

      const _appId = appId || (await addNewApp(TextBeltApp.name));
      setAppId(_appId);

      const status = (await processRequest(
        _appId,
        data
      )) as ConnectedAppStatusWithText;

      onStatusChange(status.status, status.statusText);
      setAppStatus(status);

      if (status.status === "connected") {
        onSuccess();
      } else if (status.status === "failed") {
        onError(status.statusText);
      }
    } catch (e: any) {
      onError(e?.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(createApp)} className="w-full">
          <div className="flex flex-col items-center gap-2">
            <FormField
              control={form.control}
              name="apiKey"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>
                    API key <InfoTooltip>TextBelt auth tokenr</InfoTooltip>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="API key" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="autoReply"
              render={({ field }) => (
                <ResizablePanelGroup
                  direction="horizontal"
                  className="max-md:hidden"
                >
                  <ResizablePanel className="pr-4">
                    <FormItem>
                      <FormLabel>
                        Auto reply
                        <InfoTooltip>
                          <p>
                            Can be used for notifying the user that they should
                            not reply to text message
                          </p>
                          <p>Optional</p>
                          <p>* Uses templated values</p>
                        </InfoTooltip>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Auto reply"
                          className="mx-0 focus:mx-1 active:mx-1"
                          autoResize
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {field.value?.length || 0} characters
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  </ResizablePanel>
                  <ResizableHandle withHandle />
                  <ResizablePanel className="pl-4">
                    <FormItem>
                      <FormLabel>Preview</FormLabel>
                      <div
                        className="w-full text-sm"
                        dangerouslySetInnerHTML={{
                          __html: templateSafeWithError(
                            field.value || "",
                            demoArguments
                          ).replaceAll("\n", "<br/>"),
                        }}
                      />
                    </FormItem>
                  </ResizablePanel>
                </ResizablePanelGroup>
              )}
            />
            <Button
              type="submit"
              variant="default"
              className="inline-flex gap-2 items-center w-full"
            >
              <span>Connect with</span>
              <ConnectedAppNameAndLogo app={{ name: TextBeltApp.name }} />
            </Button>
          </div>
        </form>
      </Form>
      {appStatus && <ConnectedAppStatusMessage app={appStatus} />}
    </>
  );
};
