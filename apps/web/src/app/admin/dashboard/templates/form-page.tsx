import { TemplateForm } from "@/components/admin/templates/form";
import { TemplatesTemplate } from "@/components/admin/templates/templates/type";
import { CommunicationChannelTexts } from "@/constants/labels";
import { ServicesContainer } from "@vivid/services";
import { CommunicationChannel, Template } from "@vivid/types";
import { Breadcrumbs } from "@vivid/ui";
import { demoAppointment, getArguments, template } from "@vivid/utils";
import { notFound } from "next/navigation";
import React from "react";

export const TemplateFormPage: React.FC<
  | {
      type: CommunicationChannel;
      template?: TemplatesTemplate;
    }
  | {
      id: string;
    }
> = async (props) => {
  const config =
    await ServicesContainer.ConfigurationService().getConfigurations(
      "booking",
      "general",
      "social"
    );

  const demoArguments = getArguments({
    appointment: demoAppointment,
    config,
    customer: demoAppointment.customer,
  });

  let initialData: Template | undefined;
  let type: CommunicationChannel;
  let template: TemplatesTemplate | undefined;
  if ("id" in props) {
    const data = await ServicesContainer.TemplatesService().getTemplate(
      props.id
    );
    if (!data) {
      notFound();
    }

    initialData = data;
    type = data.type;
  } else {
    type = props.type;
    template = props.template;
  }

  const breadcrumbItems = [
    { title: "Dashboard", link: "/admin/dashboard" },
    { title: "Communications", link: "/admin/dashboard/communication-logs" },
    { title: "Templates", link: "/admin/dashboard/templates" },
    {
      title: `${CommunicationChannelTexts[type]} templates`,
      link: `/admin/dashboard/templates?type=${encodeURIComponent(type)}`,
    },
  ];

  if (initialData) {
    breadcrumbItems.push({
      title: initialData.name,
      link: `/admin/dashboard/templates/${type}/${initialData._id}`,
    });
  } else {
    breadcrumbItems.push({
      title: "New",
      link: `/admin/dashboard/templates/${type}/new`,
    });
  }

  return (
    <>
      <Breadcrumbs items={breadcrumbItems} />
      {initialData ? (
        <TemplateForm args={demoArguments} initialData={initialData} />
      ) : (
        <TemplateForm args={demoArguments} type={type} template={template} />
      )}
    </>
  );
};
