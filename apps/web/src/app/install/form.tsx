"use client";

import { zodResolver } from "@hookform/resolvers/zod";
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
          success: "You have successfully create your website!",
          error: "There was a problem with your request.",
        }
      );

      router.push("/admin");
    } catch (error: any) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const onInvalid = () => {
    toast.error("Please fix errors in installation form.");
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
                    <FormLabel>Website Name</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="Website name"
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
                    <FormLabel>Website Title</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="Website title"
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
                    <FormLabel>Email address</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        type="email"
                        placeholder="Your email address"
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
                    <FormLabel>Website URL</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="Website url"
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
          Install
        </Button>
      </CardFooter>
      {loading && (
        <div className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-white opacity-50">
          <div role="status">
            <Spinner className="w-20 h-20" />
            <span className="sr-only">Please wait...</span>
          </div>
        </div>
      )}
    </>
  );
};
