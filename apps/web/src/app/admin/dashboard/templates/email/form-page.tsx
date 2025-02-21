import { EmailTemplateForm } from "@/components/admin/templates/email-form";
import { ServicesContainer } from "@vivid/services";
import { Template } from "@vivid/types";
import { Breadcrumbs } from "@vivid/ui";
import { demoAppointment, getArguments, template } from "@vivid/utils";
import { notFound, redirect } from "next/navigation";
import React from "react";

export const EmailFormPage: React.FC<{ id?: string }> = async ({ id }) => {
  const breadcrumbItems = [
    { title: "Dashboard", link: "/admin/dashboard" },
    { title: "Templates", link: "/admin/dashboard/templates" },
    { title: "Email templates", link: "/admin/dashboard/templates/email" },
  ];

  const { booking, general, social } =
    await ServicesContainer.ConfigurationService().getConfigurations(
      "booking",
      "general",
      "social"
    );

  const { arg: demoArguments } = getArguments(
    demoAppointment,
    booking,
    general,
    social
  );

  let initialData: Template | undefined;
  if (id) {
    const data = await ServicesContainer.TemplatesService().getTemplate(id);
    if (!data) {
      notFound();
      return;
    }

    initialData = data;
  }

  if (initialData) {
    breadcrumbItems.push({
      title: initialData.name,
      link: `/admin/dashboard/templates/email/${id}`,
    });
  } else {
    breadcrumbItems.push({
      title: "New",
      link: "/admin/dashboard/templates/email/new",
    });
  }

  return (
    <>
      <Breadcrumbs items={breadcrumbItems} />
      <EmailTemplateForm args={demoArguments} initialData={initialData} />
    </>
  );
};
