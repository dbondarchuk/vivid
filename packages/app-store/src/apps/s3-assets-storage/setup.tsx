"use client";

import { AppSetupProps } from "@vivid/types";
import {
  Button,
  Checkbox,
  ConnectedAppNameAndLogo,
  ConnectedAppStatusMessage,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  InfoTooltip,
  Input,
  Spinner,
} from "@vivid/ui";
import React from "react";
import { useConnectedAppSetup } from "../../hooks/use-connected-app-setup";
import { S3AssetsStorageApp } from "./app";
import { S3Configuration, s3ConfigurationSchema } from "./models";

export const S3AssetsStorageAppSetup: React.FC<AppSetupProps> = ({
  onSuccess,
  onError,
  appId,
}) => {
  const { appStatus, form, isLoading, isValid, onSubmit } =
    useConnectedAppSetup<S3Configuration>({
      appId,
      appName: S3AssetsStorageApp.name,
      schema: s3ConfigurationSchema,
      onSuccess,
      onError,
    });

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          <div className="flex flex-col items-center gap-4">
            <FormField
              control={form.control}
              name="region"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>
                    S3 region{" "}
                    <InfoTooltip>
                      Example: <em>us-east-1</em>
                    </InfoTooltip>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="us-east-1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="accessKeyId"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Access key ID</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="secretAccessKey"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Secret access key</FormLabel>
                  <FormControl>
                    <Input placeholder="" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="endpoint"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>
                    S3 endpoint{" "}
                    <InfoTooltip>
                      <strong>Optional.</strong> Provide the endpoint URL if you
                      are using non-AWS S3 compatible storage
                    </InfoTooltip>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bucket"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>
                    S3 bucket{" "}
                    <InfoTooltip>
                      <p>
                        <strong>Optional.</strong> Provide name of the S3 bucket
                      </p>
                      <p>
                        <strong>Default:</strong> <em>assets</em>
                      </p>
                    </InfoTooltip>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="assets" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="forcePathStyle"
              render={({ field }) => (
                <FormItem className="w-full">
                  <div className="flex flex-row gap-2 items-center">
                    <Checkbox
                      id="forcePathStyle"
                      disabled={isLoading}
                      checked={field.value}
                      onCheckedChange={(e) => {
                        field.onChange(!!e);
                        field.onBlur();
                      }}
                    />
                    <FormLabel
                      htmlFor="forcePathStyle"
                      className="cursor-pointer"
                    >
                      Force path style{" "}
                      <InfoTooltip>
                        Select this option if your S3 provider requires the path
                        style for objects.
                      </InfoTooltip>
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />
            <Button
              disabled={isLoading || !isValid}
              type="submit"
              variant="default"
              className="inline-flex gap-2 items-center w-full"
            >
              {isLoading && <Spinner />}
              <span>Connect with</span>
              <ConnectedAppNameAndLogo
                app={{ name: S3AssetsStorageApp.name }}
              />
            </Button>
          </div>
        </form>
      </Form>
      {appStatus && <ConnectedAppStatusMessage app={appStatus} />}
    </>
  );
};
