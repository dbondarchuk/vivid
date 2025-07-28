"use client";

import { useI18n } from "@vivid/i18n";
import { AppSetupProps } from "@vivid/types";
import {
  Button,
  ConnectedAppNameAndLogo,
  ConnectedAppStatusMessage,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Spinner,
} from "@vivid/ui";
import React from "react";
import { useConnectedAppSetup } from "../../hooks/use-connected-app-setup";
import { PaypalApp } from "./app";
import {
  paypalButtonColor,
  paypalButtonLayout,
  paypalButtonsShape,
  PaypalConfiguration,
  paypalConfigurationSchema,
} from "./models";

export const PaypalAppSetup: React.FC<AppSetupProps> = ({
  onSuccess,

  onError,

  appId,
}) => {
  const { appStatus, form, isLoading, isValid, onSubmit } =
    useConnectedAppSetup<PaypalConfiguration>({
      appId,
      appName: PaypalApp.name,
      schema: paypalConfigurationSchema,
      onSuccess,
      onError,
    });

  const t = useI18n("apps");

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          <div className="flex flex-col items-center gap-2">
            <FormField
              control={form.control}
              name="clientId"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>{t("paypal.form.clientId.label")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("paypal.form.clientId.placeholder")}
                      {...field}
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="secretKey"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>{t("paypal.form.secretKey.label")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("paypal.form.secretKey.placeholder")}
                      {...field}
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="buttonStyle.color"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>
                    {t("paypal.form.buttonStyle.color.label")}
                  </FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                        field.onBlur();
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue
                          placeholder={t("paypal.form.selectPlaceholder")}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {paypalButtonColor.map((color) => (
                          <SelectItem key={color} value={color}>
                            {t(`paypal.form.buttonStyle.color.values.${color}`)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="buttonStyle.shape"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>
                    {t("paypal.form.buttonStyle.shape.label")}
                  </FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                        field.onBlur();
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue
                          placeholder={t("paypal.form.selectPlaceholder")}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {paypalButtonsShape.map((shape) => (
                          <SelectItem key={shape} value={shape}>
                            {t(`paypal.form.buttonStyle.shape.values.${shape}`)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="buttonStyle.layout"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>
                    {t("paypal.form.buttonStyle.layout.label")}
                  </FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                        field.onBlur();
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue
                          placeholder={t("paypal.form.selectPlaceholder")}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {paypalButtonLayout.map((layout) => (
                          <SelectItem key={layout} value={layout}>
                            {t(
                              `paypal.form.buttonStyle.layout.values.${layout}`
                            )}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="buttonStyle.label"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>
                    {t("paypal.form.buttonStyle.label.label")}
                  </FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                        field.onBlur();
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue
                          placeholder={t("paypal.form.selectPlaceholder")}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pay">
                          {t(`paypal.form.buttonStyle.label.values.pay`)}
                        </SelectItem>
                        <SelectItem value="paypal">
                          {t(`paypal.form.buttonStyle.label.values.paypal`)}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
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
              <span>{t("paypal.form.connectWith")}</span>
              <ConnectedAppNameAndLogo appName={PaypalApp.name} />
            </Button>
          </div>
        </form>
      </Form>
      {appStatus && (
        <ConnectedAppStatusMessage
          status={appStatus.status}
          statusText={appStatus.statusText}
        />
      )}
    </>
  );
};
