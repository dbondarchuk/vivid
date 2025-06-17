"use client";

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
import { capitalize } from "@vivid/utils";

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
                  <FormLabel>Client ID</FormLabel>
                  <FormControl>
                    <Input placeholder="Client ID" {...field} type="password" />
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
                  <FormLabel>Secret key</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Secret key"
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
                  <FormLabel>Paypal button color</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                        field.onBlur();
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select view" />
                      </SelectTrigger>
                      <SelectContent>
                        {paypalButtonColor.map((color) => (
                          <SelectItem key={color} value={color}>
                            {capitalize(color)}
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
                  <FormLabel>Paypal button color</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                        field.onBlur();
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select view" />
                      </SelectTrigger>
                      <SelectContent>
                        {paypalButtonsShape.map((shape) => (
                          <SelectItem key={shape} value={shape}>
                            {capitalize(shape)}
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
                  <FormLabel>Paypal button layout</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                        field.onBlur();
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select view" />
                      </SelectTrigger>
                      <SelectContent>
                        {paypalButtonLayout.map((layout) => (
                          <SelectItem key={layout} value={layout}>
                            {capitalize(layout)}
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
                  <FormLabel>Paypal button label</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                        field.onBlur();
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select view" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pay">Pay with PayPal</SelectItem>
                        <SelectItem value="paypal">PayPal</SelectItem>
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
              <span>Connect with</span>
              <ConnectedAppNameAndLogo app={{ name: PaypalApp.name }} />
            </Button>
          </div>
        </form>
      </Form>
      {appStatus && <ConnectedAppStatusMessage app={appStatus} />}
    </>
  );
};
