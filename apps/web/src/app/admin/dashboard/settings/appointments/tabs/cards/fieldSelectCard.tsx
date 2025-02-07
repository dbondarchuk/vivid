import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FieldSchema } from "@vivid/types";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
  Card,
  CardContent,
  CardHeader,
  cn,
  Combobox,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  IComboboxItem,
  InfoTooltip,
  Switch,
} from "@vivid/ui";
import { cva } from "class-variance-authority";
import { GripVertical, Trash } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { fieldTypeLabels } from "./fieldCard";

export type FieldSelectProps = {
  item: {
    id: string;
    fields_id: string;
  };
  name: string;
  type: "option" | "addon";
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
    fields_id: string;
  };
}

export const FieldSelectCard: React.FC<FieldSelectProps> = ({
  item,
  form,
  name,
  type,
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
    id: item.fields_id,
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

  const { id } = form.getValues(name);
  const field = form.getValues("fields").find((x: FieldSchema) => x.id === id);

  const nameValue = field?.name;

  const fieldValues = form.getValues("fields").map(
    (field: FieldSchema) =>
      ({
        value: field.id,
        shortLabel: field.data?.label || field.name,
        label: (
          <div className="flex flex-col gap-1">
            <div>{field.data?.label || field.name}</div>
            <div className="text-sm">
              {field.name} - {fieldTypeLabels[field.type]}
            </div>
          </div>
        ),
      }) as IComboboxItem
  );

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={variants({
        dragging: isOverlay ? "overlay" : isDragging ? "over" : undefined,
      })}
    >
      <AccordionItem value={item.fields_id}>
        <CardHeader className="justify-between relative flex flex-row border-b-2 border-secondary px-3 py-3 w-full">
          <Button
            type="button"
            variant={"ghost"}
            {...attributes}
            {...listeners}
            className="-ml-2 h-auto cursor-grab p-1 text-secondary-foreground/50"
          >
            <></>
            <span className="sr-only">Move {type} field</span>
            <GripVertical />
          </Button>
          <AccordionTrigger className={cn(!nameValue && "text-destructive")}>
            {nameValue || "Invalid field"}
          </AccordionTrigger>
          <div className="flex flex-row gap-2 items-center">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  disabled={disabled}
                  variant="destructive"
                  className=""
                  size="sm"
                  type="button"
                >
                  <Trash size={20} />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to remove this field from this {type}?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction asChild>
                    <Button variant="destructive" onClick={remove}>
                      Delete
                    </Button>
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardHeader>
        <AccordionContent>
          <CardContent className="px-3 pb-6 pt-3 text-left relative flex flex-col gap-2">
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
            <FormField
              control={form.control}
              name={`${name}.required`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Required{" "}
                    <InfoTooltip>Marks field as to be required</InfoTooltip>
                  </FormLabel>
                  <FormControl>
                    <div className="!mt-4">
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
        </AccordionContent>
      </AccordionItem>
    </Card>
  );
};
