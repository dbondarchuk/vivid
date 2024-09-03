import { Card, CardHeader, CardContent } from "@/components/ui/card";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cva } from "class-variance-authority";
import { GripVertical, Trash } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Combobox, IComboboxItem } from "@/components/ui/combobox";
import { FieldSchema, fieldTypeLabels } from "./fieldCard";

export type FieldSelectProps = {
  item: {
    id: string;
  };
  name: string;
  form: UseFormReturn<any>;
  disabled?: boolean;
  isOverlay?: boolean;
  remove: () => void;
  update: (newValue: string) => void;
};

export type FieldSelectType = "FieldSelect";

export interface FieldSelectDragData {
  type: FieldSelectType;
  item: {
    id: string;
  };
}

export const FieldSelectCard: React.FC<FieldSelectProps> = ({
  item,
  form,
  name,
  disabled,
  isOverlay,
  remove,
  update,
}) => {
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
      type: "FieldSelect",
      item,
    } satisfies FieldSelectDragData,
    attributes: {
      roleDescription: "Field",
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

  const id = form.getValues(name);
  const nameValue = form
    .getValues("fields")
    .find((x: FieldSchema) => x.id === id);

  const fieldValues = form.getValues("fields").map(
    (field: FieldSchema) =>
      ({
        value: field.id,
        shortLabel: field.name,
        label: (
          <div className="flex flex-col gap-1">
            <div>{field.name}</div>
            <div className="text-sm">{fieldTypeLabels[field.type]}</div>
          </div>
        ),
      } as IComboboxItem)
  );

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
          <></>
          <span className="sr-only">Move appointment field</span>
          <GripVertical />
        </Button>
        <span>{nameValue || "Field"}</span>
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
      <CardContent className="px-3 pb-6 pt-3 text-left relative">
        <FormField
          control={form.control}
          name={`${name}.id`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Field</FormLabel>

              <FormControl>
                <Combobox
                  disabled={disabled}
                  className="flex w-full font-normal text-base"
                  values={fieldValues}
                  searchLabel="Select field"
                  value={field.value}
                  onItemSelect={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};
