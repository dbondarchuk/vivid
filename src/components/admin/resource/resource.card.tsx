import { Resource, resourceSchema, resourceSourceTypeLabels } from "@/types";
import { useSortable } from "@dnd-kit/sortable";
import { UseFormReturn } from "react-hook-form";
import { CSS } from "@dnd-kit/utilities";
import { cva } from "class-variance-authority";
import { stripObject } from "@/lib/stripObject";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Combobox, IComboboxItem } from "@/components/ui/combobox";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { GripVertical, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Editor } from "@monaco-editor/react";

export type ResourceWithId = Resource & {
  id: string;
};

export type ResourceCardProps = {
  type: "script" | "css";
  item: ResourceWithId;
  name: string;
  form: UseFormReturn<any>;
  disabled?: boolean;
  isOverlay?: boolean;
  remove: () => void;
  update: (newValue: ResourceWithId) => void;
};

export type ResourceType = "Resource";

export interface ResourceDragData {
  type: ResourceType;
  item: ResourceWithId;
}

const resourceSourceTypeValues = Object.entries(resourceSourceTypeLabels).map(
  ([value, label]) =>
    ({
      value,
      label,
    } as IComboboxItem)
);

export const ResourceCard = ({
  type,
  item,
  form,
  name,
  disabled,
  isOverlay,
  remove,
  update,
}: ResourceCardProps) => {
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
      type: "Resource",
      item,
    } satisfies ResourceDragData,
    attributes: {
      roleDescription: "Resource",
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

  const itemSourceType = item.source;

  const changeSource = (value: typeof itemSourceType) => {
    const newValue = {
      ...form.getValues(name),
      source: value,
    };

    const strippedValue = stripObject(newValue, resourceSchema) as Resource;

    update(strippedValue as ResourceWithId);
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
          <span className="sr-only">Move resource</span>
          <GripVertical />
        </Button>
        <span
          className={cn(
            !resourceSourceTypeLabels[itemSourceType] ? "text-destructive" : ""
          )}
        >
          {itemSourceType
            ? resourceSourceTypeLabels[itemSourceType]
            : "Invalid"}
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
          name={`${name}.source`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Source type</FormLabel>

              <FormControl>
                <Combobox
                  disabled={disabled}
                  className="flex w-full font-normal text-base"
                  values={resourceSourceTypeValues}
                  searchLabel="Select source type"
                  value={field.value}
                  onItemSelect={(value) => {
                    field.onChange(value);
                    changeSource(value as any);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {itemSourceType === "remote" && (
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
        {itemSourceType === "inline" && (
          <>
            <FormField
              control={form.control}
              name={`${name}.value`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <Editor
                      height="20vh"
                      language={type === "script" ? "javascript" : "css"}
                      value={field.value}
                      onChange={(e) => {
                        field.onChange(e);
                        field.onBlur();
                      }}
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