"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useI18n } from "@vivid/i18n";
import {
  Button,
  CardContent,
  CardFooter,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Spinner,
  toast,
  toastPromise,
} from "@vivid/ui";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { install } from "./actions";
import { InstallFormData, installSchema } from "./types";

export const InstallForm: React.FC = () => {
  const t = useI18n("admin");
  const form = useForm<InstallFormData>({
    resolver: zodResolver(installSchema),
    mode: "all",
    values: {
      url: window.location.origin,
    } as Partial<InstallFormData> as InstallFormData,
  });

  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  const onSubmit = async (data: InstallFormData) => {
    try {
      setLoading(true);

      await toastPromise(
        install({
          ...data,
        }),
        {
          success: t("install.form.success"),
          error: t("install.form.error"),
        },
      );

      router.push("/admin");
    } catch (error: any) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const onInvalid = () => {
    toast.error(t("install.form.fixErrors"));
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-8 relative"
        >
          <CardContent>
            <div className="gap-4 flex flex-col">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("install.form.websiteName")}</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder={t("install.form.websiteNamePlaceholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("install.form.websiteTitle")}</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder={t("install.form.websiteTitlePlaceholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("install.form.emailAddress")}</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        type="email"
                        placeholder={t("install.form.emailAddressPlaceholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("install.form.websiteUrl")}</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder={t("install.form.websiteUrlPlaceholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </form>
      </Form>
      <CardFooter className="justify-center w-full flex">
        <Button
          variant="default"
          size="lg"
          fontSize="lg"
          className="w-full"
          onClick={form.handleSubmit(onSubmit, onInvalid)}
        >
          {t("install.form.install")}
        </Button>
      </CardFooter>
      {loading && (
        <div className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-white opacity-50">
          <div role="status">
            <Spinner className="w-20 h-20" />
            <span className="sr-only">{t("install.form.pleaseWait")}</span>
          </div>
        </div>
      )}
    </>
  );
};
