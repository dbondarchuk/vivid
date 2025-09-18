import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useI18n } from "@vivid/i18n";
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
} from "@vivid/ui";
import { cva } from "class-variance-authority";
import { GripVertical, Trash } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { OptionSelector } from "./option-selector";

export type OptionSelectProps = {
  item: {
    id: string;
    fields_id: string;
  };
  excludeIds?: string[];
  name: string;
  form: UseFormReturn<any>;
  disabled?: boolean;
  isOverlay?: boolean;
  remove: () => void;
};

export type OptionSelectType = "OptionSelect";

export interface OptionSelectDragData {
  type: OptionSelectType;
  item: {
    fields_id: string;
  };
}

export const OptionSelectCard: React.FC<OptionSelectProps> = ({
  item,
  form,
  name,
  excludeIds,
  disabled,
  isOverlay,
  remove,
}) => {
  const t = useI18n("admin");
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
      type: "OptionSelect",
      item,
    } satisfies OptionSelectDragData,
    attributes: {
      roleDescription: t(
        "settings.appointments.form.cards.optionSelect.roleDescription",
      ),
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
        "flex flex-row gap-2 px-2 py-4 bg-card rounded",
        variants({
          dragging: isOverlay ? "overlay" : isDragging ? "over" : undefined,
        }),
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
        <span className="sr-only">
          {t("settings.appointments.form.cards.optionSelect.moveOption")}
        </span>
        <GripVertical />
      </Button>
      <div className="grid grid-cols-1 gap-2 flex-grow w-full">
        <FormField
          control={form.control}
          name={`${name}.id`}
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>
                {t("settings.appointments.form.cards.optionSelect.option")}
              </FormLabel>

              <FormControl>
                <OptionSelector
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
              <AlertDialogTitle>
                {t(
                  "settings.appointments.form.cards.optionSelect.deleteConfirmTitle",
                )}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {t(
                  "settings.appointments.form.cards.optionSelect.deleteConfirmDescription",
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>
                {t("settings.appointments.form.cards.optionSelect.cancel")}
              </AlertDialogCancel>
              <AlertDialogAction asChild variant="destructive">
                <Button onClick={remove}>
                  {t("settings.appointments.form.cards.optionSelect.delete")}
                </Button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};
