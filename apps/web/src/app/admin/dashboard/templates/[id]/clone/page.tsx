import { ServicesContainer } from "@vivid/services";
import { notFound, redirect } from "next/navigation";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function CloneTemplatePage(props: Props) {
  const { id } = await props.params;

  const template = await ServicesContainer.TemplatesService().getTemplate(id);
  if (!template) {
    notFound();
  }

  const { updatedAt: _, _id: __, ...newTemplate } = template;
  newTemplate.name = template.name + " Copy";

  const { _id } =
    await ServicesContainer.TemplatesService().createTemplate(newTemplate);

  redirect(`/admin/dashboard/templates/${_id}`);
}
