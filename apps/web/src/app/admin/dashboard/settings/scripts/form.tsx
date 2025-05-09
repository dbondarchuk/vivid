"use client";

import { ResourcesCard } from "@/components/admin/resource/resources-card";
import { zodResolver } from "@hookform/resolvers/zod";
import { ScriptsConfiguration, scriptsConfigurationSchema } from "@vivid/types";
import { Form, SaveButton, toastPromise } from "@vivid/ui";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { updateScriptsConfiguration } from "./actions";

export const ScriptsSettingsForm: React.FC<{
  values: ScriptsConfiguration;
}> = ({ values }) => {
  const form = useForm<ScriptsConfiguration>({
    resolver: zodResolver(scriptsConfigurationSchema),
    mode: "all",
    values,
  });

  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  const onSubmit = async (data: ScriptsConfiguration) => {
    try {
      setLoading(true);
      await toastPromise(updateScriptsConfiguration(data), {
        success: "Your changes were saved.",
        error: "There was a problem with your request.",
      });

      router.refresh();
    } catch (error: any) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full space-y-8 relative"
      >
        <div className="flex gap-8 flex-col">
          <ResourcesCard
            type="script"
            form={form}
            name="header"
            title="Header scripts"
            loading={loading}
          />
          <ResourcesCard
            type="script"
            form={form}
            name="footer"
            title="Footer scripts"
            loading={loading}
          />
        </div>
        <SaveButton form={form} disabled={loading} />
      </form>
    </Form>
  );
};
