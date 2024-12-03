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
} from "@/components/ui/alert-dialog";
import { AppointmentAddon } from "@/types";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

export type AddonSelectProps = {
  item: {
    id: string;
    fields_id: string;
  };
  name: string;
  form: UseFormReturn<any>;
  disabled?: boolean;
  isOverlay?: boolean;
  remove: () => void;
  update: (newValue: string) => void;
};

export type AddonSelectType = "AddonSelect";

export interface AddonSelectDragData {
  type: AddonSelectType;
  item: {
    id: string;
    fields_id: string;
  };
}

export const AddonSelectCard: React.FC<AddonSelectProps> = ({
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
    id: item.fields_id,
    data: {
      type: "AddonSelect",
      item,
    } satisfies AddonSelectDragData,
    attributes: {
      roleDescription: "Addon",
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
  const addon = form
    .getValues("addons")
    .find((x: AppointmentAddon) => x.id === id);

  const nameValue = addon?.name;

  const addonValues = form.getValues("addons").map(
    (addon: AppointmentAddon) =>
      ({
        value: addon.id,
        shortLabel: addon.name,
        label: (
          <div className="flex flex-col gap-1">
            <div>{addon.name}</div>
            <div>{addon.duration}</div>
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
            <span className="sr-only">Move appointment addon</span>
            <GripVertical />
          </Button>
          <AccordionTrigger className={cn(!nameValue && "text-destructive")}>
            {nameValue || "Invalid addon"}
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
                    Are you sure you want to remove this addon from this option?
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
          <CardContent className="px-3 pb-6 pt-3 text-left relative">
            <FormField
              control={form.control}
              name={`${name}.id`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Addon</FormLabel>

                  <FormControl>
                    <Combobox
                      disabled={disabled}
                      className="flex w-full font-normal text-base"
                      values={addonValues}
                      searchLabel="Select addon"
                      value={field.value}
                      onItemSelect={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </AccordionContent>
      </AccordionItem>
    </Card>
  );
};
