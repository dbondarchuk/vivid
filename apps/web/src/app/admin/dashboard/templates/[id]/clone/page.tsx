import { ServicesContainer } from "@vivid/services";
import { getLoggerFactory } from "@vivid/logger";
import { notFound, redirect } from "next/navigation";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function CloneTemplatePage(props: Props) {
  const logger = getLoggerFactory("AdminPages")("clone-template");
  const { id } = await props.params;

  logger.debug(
    {
      templateId: id,
    },
    "Starting template clone operation"
  );

  const template = await ServicesContainer.TemplatesService().getTemplate(id);
  if (!template) {
    logger.warn({ templateId: id }, "Template not found for cloning");
    notFound();
  }

  const { updatedAt: _, _id: __, ...newTemplate } = template;
  newTemplate.name = template.name + " Copy";

  logger.debug(
    {
      originalTemplateId: id,
      originalName: template.name,
      newName: newTemplate.name,
    },
    "Creating cloned template"
  );

  const { _id } =
    await ServicesContainer.TemplatesService().createTemplate(newTemplate);

  logger.debug(
    {
      originalTemplateId: id,
      newTemplateId: _id,
      newName: newTemplate.name,
    },
    "Template cloned successfully, redirecting"
  );

  redirect(`/admin/dashboard/templates/${_id}`);
}
