import { CommunicationChannel, TemplateListModel } from "@vivid/types";
import React from "react";
import { cn } from "../utils";
import { Combobox, IComboboxItem } from "./combobox";
import { toast } from "sonner";

const getTemplates = async (type: string) => {
  const url = `/admin/api/templates?type=${encodeURIComponent(type)}&limit=10000000`;
  const response = await fetch(url, {
    method: "GET",
    cache: "default",
  });

  if (response.status >= 400) {
    toast.error("Request failed.");
    const text = await response.text();
    console.error(
      `Request to fetch templates failed: ${response.status}; ${text}`
    );

    return [];
  }

  return (await response.json()) as TemplateListModel[];
};

const checkTemplateSearch = (template: TemplateListModel, query: string) => {
  const search = query.toLocaleLowerCase();
  return template.name.toLocaleLowerCase().includes(search);
};

type BaseTemplateSelectorProps = {
  type: CommunicationChannel;
  value?: string;
  disabled?: boolean;
  className?: string;
};

type ClearableTemplateSelectorProps = {
  onItemSelect?: (value: string | undefined) => void;
  allowClear: true;
};

type NonClearableTemplateSelectorProps = {
  onItemSelect?: (value: string) => void;
  allowClear?: false;
};

export type TemplateSelectorProps = BaseTemplateSelectorProps &
  (ClearableTemplateSelectorProps | NonClearableTemplateSelectorProps);

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  type,
  disabled,
  className,
  value,
  onItemSelect,
  allowClear,
}) => {
  const [templates, setTemplates] = React.useState<TemplateListModel[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    const fn = async () => {
      try {
        setIsLoading(true);
        const templates = await getTemplates(type);
        setTemplates(templates);
      } finally {
        setIsLoading(false);
      }
    };

    fn();
  }, [type]);

  const templateValues = (templates: TemplateListModel[]): IComboboxItem[] =>
    (templates || []).map((template) => {
      return {
        value: template._id,
        shortLabel: template.name,
        label: template.name,
      };
    });

  return (
    // @ts-ignore Allow clear passthrough
    <Combobox
      allowClear={allowClear}
      disabled={disabled || isLoading}
      className={cn("flex font-normal text-base", className)}
      values={templateValues(templates)}
      searchLabel={isLoading ? "Loading templates..." : "Select template"}
      value={value}
      customSearch={(search) =>
        templateValues(
          templates.filter((template) => checkTemplateSearch(template, search))
        )
      }
      onItemSelect={onItemSelect}
    />
  );
};
