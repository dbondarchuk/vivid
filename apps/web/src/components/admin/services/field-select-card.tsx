import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
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
  cn,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  InfoTooltip,
  Switch,
} from "@vivid/ui";
import { cva } from "class-variance-authority";
import { GripVertical, Trash } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { FieldSelector } from "./field-selector";

export type FieldSelectProps = {
  item: {
    id: string;
    fields_id: string;
  };
  excludeIds?: string[];
  name: string;
  type: "option" | "addon";
  form: UseFormReturn<any>;
  disabled?: boolean;
  isOverlay?: boolean;
  remove: () => void;
};

export type FieldSelectType = "AddonSelect";

export interface FieldSelectDragData {
  type: FieldSelectType;
  item: {
    fields_id: string;
  };
}

export const FieldSelectCard: React.FC<FieldSelectProps> = ({
  item,
  excludeIds,
  form,
  name,
  type,
  disabled,
  isOverlay,
  remove,
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
      type: "AddonSelect",
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

  return (
    <div
      className={cn(
        "flex flex-row gap-2 px-2 py-4 bg-background rounded",
        variants({
          dragging: isOverlay ? "overlay" : isDragging ? "over" : undefined,
        })
      )}
      ref={setNodeRef}
      style={style}
    >
      <Button
        type="button"
        variant={"ghost"}
        {...attributes}
        {...listeners}
        className="h-auto cursor-grab p-1 text-secondary-foreground/50"
      >
        <></>
        <span className="sr-only">Move {type} field</span>
        <GripVertical />
      </Button>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 flex-grow w-full">
        <FormField
          control={form.control}
          name={`${name}.id`}
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Field</FormLabel>

              <FormControl>
                <FieldSelector
                  disabled={disabled}
                  excludeIds={excludeIds}
                  className="flex w-full font-normal text-base"
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
            <FormItem className="w-full">
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
      </div>
      <div className="flex flex-row items-center">
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
              <AlertDialogAction asChild variant="destructive">
                <Button onClick={remove}>Delete</Button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};
