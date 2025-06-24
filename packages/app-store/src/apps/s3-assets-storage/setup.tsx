"use client";

import { useI18n } from "@vivid/i18n";
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
  const t = useI18n("apps");

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
                    {t("s3AssetsStorage.form.region.label")}{" "}
                    <InfoTooltip>
                      {t("s3AssetsStorage.form.region.tooltip")}
                    </InfoTooltip>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("s3AssetsStorage.form.region.placeholder")}
                      {...field}
                    />
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
                  <FormLabel>
                    {t("s3AssetsStorage.form.accessKeyId.label")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t(
                        "s3AssetsStorage.form.accessKeyId.placeholder"
                      )}
                      {...field}
                    />
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
                  <FormLabel>
                    {t("s3AssetsStorage.form.secretAccessKey.label")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t(
                        "s3AssetsStorage.form.secretAccessKey.placeholder"
                      )}
                      type="password"
                      {...field}
                    />
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
                    {t("s3AssetsStorage.form.endpoint.label")}{" "}
                    <InfoTooltip>
                      {t("s3AssetsStorage.form.endpoint.tooltip")}
                    </InfoTooltip>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t(
                        "s3AssetsStorage.form.endpoint.placeholder"
                      )}
                      {...field}
                    />
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
                    {t("s3AssetsStorage.form.bucket.label")}{" "}
                    <InfoTooltip>
                      {t("s3AssetsStorage.form.bucket.tooltip")}
                    </InfoTooltip>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("s3AssetsStorage.form.bucket.placeholder")}
                      {...field}
                    />
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
                      {t("s3AssetsStorage.form.forcePathStyle.label")}{" "}
                      <InfoTooltip>
                        {t("s3AssetsStorage.form.forcePathStyle.tooltip")}
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
              <span>{t("s3AssetsStorage.form.connect")}</span>
              <ConnectedAppNameAndLogo
                app={{ name: S3AssetsStorageApp.name }}
                t={t}
              />
            </Button>
          </div>
        </form>
      </Form>
      {appStatus && <ConnectedAppStatusMessage app={appStatus} t={t} />}
    </>
  );
};
