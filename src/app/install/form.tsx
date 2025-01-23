"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { install } from "./actions";
import { toast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { InstallFormData, installSchema } from "./types";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";

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
      await install({
        ...data,
      });

      toast({
        variant: "default",
        title: "Success!",
        description: "You have successfully create your website!",
      });

      router.push("/admin");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
    } finally {
      setLoading(false);
    }
  };

  const onInvalid = () => {
    toast({
      variant: "destructive",
      title: "Please fix errors",
      description: "Please fix errors in installation form.",
    });
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
