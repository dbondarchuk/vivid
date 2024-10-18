"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useMemo } from "react";
import {
  FieldPath,
  useFieldArray,
  useForm,
  UseFormReturn,
} from "react-hook-form";
import { z } from "zod";
import { updateScriptsConfiguration } from "./actions";
import { Sortable } from "@/components/ui/sortable";
import { SaveButton } from "@/components/admin/forms/save-button";
import { CSS } from "@dnd-kit/utilities";
import { RemoteScript, Script } from "@/types";
import { useSortable } from "@dnd-kit/sortable";
import { cva } from "class-variance-authority";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GripVertical, Trash } from "lucide-react";
import { cn } from "@/lib/utils";
import { stripObject } from "@/lib/stripObject";
import { Combobox, IComboboxItem } from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { InfoTooltip } from "@/components/admin/tooltip/infoTooltip";
import { Switch } from "@/components/ui/switch";

const inlineScriptType = "inline" as const;
const remoteScriptType = "remote" as const;

const scriptTypeLabels = {
  [inlineScriptType]: "Inline",
  [remoteScriptType]: "Remote",
};

const scriptTypeValues = Object.entries(scriptTypeLabels).map(
  ([value, label]) =>
    ({
      value,
      label,
    } as IComboboxItem)
);

const scriptType = z.enum([inlineScriptType, remoteScriptType]);

const inlineScriptSchema = z.object({
  type: scriptType.extract(["inline"]),
  value: z.string().min(1, "Script value is required"),
});

const remoteScriptSchema = z.object({
  type: scriptType.extract(["remote"]),
  url: z.string().url("Must be a valid url"),
});

const scriptSchema = z.discriminatedUnion("type", [
  inlineScriptSchema,
  remoteScriptSchema,
]);

type ScriptSchema = z.infer<typeof scriptSchema>;

const formSchema = z.object({
  headerScripts: z.array(scriptSchema).optional(),
  footerScripts: z.array(scriptSchema).optional(),
});

type FormValues = z.infer<typeof formSchema>;

type ScriptWithId = Script & {
  id: string;
};

type ScriptCardProps = {
  item: ScriptWithId;
  name: string;
  form: UseFormReturn<any>;
  disabled?: boolean;
  isOverlay?: boolean;
  remove: () => void;
  update: (newValue: ScriptWithId) => void;
};

type ScriptType = "Script";

interface ScriptDragData {
  type: ScriptType;
  item: ScriptWithId;
}

const ScriptCard = ({
  item,
  form,
  name,
  disabled,
  isOverlay,
  remove,
  update,
}: ScriptCardProps) => {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: item.id,
    data: {
      type: "Script",
      item,
    } satisfies ScriptDragData,
    attributes: {
      roleDescription: "Script",
    },
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  };

  const variants = cva("", {
    variants: {
      dragging: {
        over: "ring-2 opacity-30",
        overlay: "ring-2 ring-primary",
      },
    },
  });

  const itemType = item.type;

  const changeType = (value: typeof itemType) => {
    const newValue = {
      ...form.getValues(name),
      type: value,
    };

    const strippedValue = stripObject(newValue, scriptSchema) as ScriptSchema;

    update(strippedValue as ScriptWithId);
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={variants({
        dragging: isOverlay ? "overlay" : isDragging ? "over" : undefined,
      })}
    >
      <CardHeader className="justify-between relative flex flex-row border-b-2 border-secondary px-3 py-3 w-full">
        <Button
          type="button"
          variant={"ghost"}
          {...attributes}
          {...listeners}
          className="-ml-2 h-auto cursor-grab p-1 text-secondary-foreground/50"
        >
          <span className="sr-only">Move script</span>
          <GripVertical />
        </Button>
        <span
          className={cn(!scriptTypeLabels[itemType] ? "text-destructive" : "")}
        >
          {itemType ? scriptTypeLabels[itemType] : "Invalid"}
        </span>
        <Button
          disabled={disabled}
          variant="destructive"
          className=""
          onClick={remove}
          size="sm"
          type="button"
        >
          <Trash size={20} />
        </Button>
      </CardHeader>
      <CardContent className="px-3 pb-6 pt-3 text-left relative grid md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name={`${name}.type`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Script type</FormLabel>

              <FormControl>
                <Combobox
                  disabled={disabled}
                  className="flex w-full font-normal text-base"
                  values={scriptTypeValues}
                  searchLabel="Select type"
                  value={field.value}
                  onItemSelect={(value) => {
                    field.onChange(value);
                    changeType(value as any);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {itemType === "remote" && (
          <>
            <FormField
              control={form.control}
              name={`${name}.url`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Url</FormLabel>
                  <FormControl>
                    <Input disabled={disabled} placeholder="Url" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}
        {itemType === "inline" && (
          <>
            <FormField
              control={form.control}
              name={`${name}.value`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={disabled}
                      placeholder="Value"
                      autoResize
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
};

const ScriptsCard = ({
  form,
  name,
  title,
  loading,
}: {
  form: UseFormReturn<FormValues>;
  name: keyof FormValues;
  title: string;
  loading?: boolean;
}) => {
  const { fields, append, remove, swap, update } = useFieldArray({
    control: form.control,
    name,
  });

  const ids = useMemo(() => fields.map((x) => x.id), [fields]);

  const sort = (activeId: string, overId: string) => {
    const activeIndex = fields.findIndex((x) => x.id === activeId);
    const overIndex = fields.findIndex((x) => x.id === overId);

    if (activeIndex < 0 || overIndex < 0) return;

    swap(activeIndex, overIndex);
  };

  const addNew = () => {
    append({
      type: "remote",
    } as Partial<RemoteScript> as RemoteScript);
  };

  return (
    <Sortable title={title} ids={ids} onSort={sort} onAdd={addNew}>
      <div className="flex flex-grow flex-col gap-4">
        {fields.map((item, index) => {
          return (
            <ScriptCard
              form={form}
              item={item}
              key={item.id}
              name={`${name}.${index}`}
              disabled={loading}
              remove={() => remove(index)}
              update={(newValue) => update(index, newValue)}
            />
          );
        })}
      </div>
    </Sortable>
  );
};

export const ScriptsSettingsForm: React.FC<{
  values: FormValues;
}> = ({ values }) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "all",
    values,
  });

  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  const onSubmit = async (data: FormValues) => {
    try {
      setLoading(true);
      await updateScriptsConfiguration(data);
      router.refresh();
      toast({
        variant: "default",
        title: "Saved",
        description: "Your changes were saved.",
      });
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

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full space-y-8 relative"
      >
        <div className="flex gap-8 flex-col">
          <ScriptsCard
            form={form}
            name="headerScripts"
            title="Header scripts"
            loading={loading}
          />
          <ScriptsCard
            form={form}
            name="footerScripts"
            title="Footer scripts"
            loading={loading}
          />
        </div>
        <SaveButton form={form} disabled={loading} />
      </form>
    </Form>
  );
};
