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
import {
  ColorOverrideSchema,
  colors as colorOverrides,
  fontsNames,
  StylingConfiguration,
  stylingConfigurationSchema,
} from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { updateStylingConfiguration } from "./actions";
import { SaveButton } from "@/components/admin/forms/save-button";
import { Combobox, IComboboxItem } from "@/components/ui/combobox";
import { ResourcesCard } from "@/components/admin/resource/resources.card";
import { InputColorPicker } from "@/components/ui/inputColorPicker";
import { NonSortable } from "@/components/ui/nonSortable";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
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
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { InfoTooltip } from "@/components/admin/tooltip/infoTooltip";

const fontTransform = (font: string) => ({
  value: font,
  shortLabel: font,
  label: (
    <div className="flex flex-col gap-0.5">
      <span>{font}</span>
      <a
        className="text-sm text-muted-foreground underline"
        target="_blank"
        href={`https://fonts.google.com/specimen/${font.replace(" ", "+")}`}
      >
        See on Google Fonts
      </a>
    </div>
  ),
});

const colorsLabels: Record<(typeof colorOverrides)[number], string> = {
  background: "Background",
  foreground: "Text",
  card: "Card",
  "card-foreground": "Card text",
  popover: "Popover",
  "popover-foreground": "Popover text",
  primary: "Primary",
  "primary-foreground": "Primary text",
  secondary: "Secondary",
  "secondary-foreground": "Secondary text",
  muted: "Muted",
  "muted-foreground": "Muted text",
  accent: "Accent",
  "accent-foreground": "Accent text",
  destructive: "Destructive",
  "destructive-foreground": "Destructive text",
};

const customFontSearch = (search: string) => {
  const lowerSearch = search.toLocaleLowerCase();
  return fontsNames
    .filter((font) => font.toLocaleLowerCase().indexOf(lowerSearch) >= 0)
    .map(fontTransform);
};

export const StylingsConfigurationForm: React.FC<{
  values: StylingConfiguration;
}> = ({ values }) => {
  const form = useForm<StylingConfiguration>({
    resolver: zodResolver(stylingConfigurationSchema),
    mode: "all",
    values,
  });

  const fonts: IComboboxItem[] = React.useMemo(
    () => fontsNames.map(fontTransform),
    []
  );

  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  const onSubmit = async (data: StylingConfiguration) => {
    try {
      setLoading(true);
      await updateStylingConfiguration({
        ...data,
      });
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

  const {
    fields: colors,
    append: appendColor,
    remove: removeColor,
  } = useFieldArray({
    control: form.control,
    name: "colors",
    keyName: "fields_id",
  });

  const colorsIds = React.useMemo(() => colors.map((c) => c.type), [colors]);

  const addNewColor = () => {
    appendColor({
      value: "",
    } as Partial<ColorOverrideSchema> as ColorOverrideSchema);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full space-y-8 relative"
      >
        <div className="flex gap-8 flex-col">
          <div className="gap-2 flex flex-col md:grid md:grid-cols-3 md:gap-4">
            <FormField
              control={form.control}
              name="fonts.primary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Primary font</FormLabel>
                  <FormControl>
                    <Combobox
                      allowClear
                      values={fonts}
                      disabled={loading}
                      className="flex w-full font-normal text-base"
                      searchLabel="Select font"
                      value={field.value}
                      onItemSelect={(value) => {
                        field.onChange(value);
                      }}
                      customSearch={customFontSearch}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fonts.secondary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Secondary font</FormLabel>
                  <FormControl>
                    <Combobox
                      values={fonts}
                      disabled={loading}
                      className="flex w-full font-normal text-base"
                      searchLabel="Select font"
                      value={field.value}
                      allowClear
                      onItemSelect={(value) => {
                        field.onChange(value);
                      }}
                      customSearch={customFontSearch}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fonts.tertiary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tertiary font</FormLabel>
                  <FormControl>
                    <Combobox
                      allowClear
                      values={fonts}
                      disabled={loading}
                      className="flex w-full font-normal text-base"
                      searchLabel="Select font"
                      value={field.value}
                      onItemSelect={(value) => {
                        field.onChange(value);
                      }}
                      customSearch={customFontSearch}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <NonSortable
            title="Color overrides"
            ids={colorsIds}
            onAdd={addNewColor}
          >
            <div className="flex flex-grow flex-col gap-4">
              {colors.map((color, index) => {
                const type = form.getValues(`colors.${index}.type`);
                const hasMultipleTypes =
                  form.getValues("colors").filter((c) => c.type === type)
                    .length > 1;

                return (
                  <Card key={index}>
                    <CardHeader className="justify-between relative flex flex-row items-center border-b-2 border-secondary px-3 py-3 w-full">
                      <div className="hidden md:block">&nbsp;</div>
                      <div
                        className={cn(
                          "w-full text-center flex flex-col",
                          (!type || hasMultipleTypes) && "text-destructive"
                        )}
                      >
                        {colorsLabels[type] || "Invalid field"}
                        {hasMultipleTypes && (
                          <span className="text-sm">Duplicate type</span>
                        )}
                      </div>
                      <div className="flex flex-row gap-2">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              disabled={loading}
                              variant="destructive"
                              className=""
                              size="sm"
                              type="button"
                              title="Remove"
                            >
                              <Trash size={20} />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Are you absolutely sure?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure that you want to remove this color
                                override?
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction asChild>
                                <Button
                                  variant="destructive"
                                  onClick={() => removeColor(index)}
                                >
                                  Delete
                                </Button>
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </CardHeader>
                    <CardContent className="px-3 pb-6 pt-3 text-left relative grid md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name={`colors.${index}.type`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Type</FormLabel>
                            <FormControl>
                              <Combobox
                                disabled={loading}
                                className="flex w-full font-normal text-base"
                                values={colorOverrides.map((color) => ({
                                  value: color,
                                  label: colorsLabels[color],
                                }))}
                                searchLabel="Select color override type"
                                value={field.value}
                                onItemSelect={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`colors.${index}.value`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Color{" "}
                              <InfoTooltip>
                                Color in CSS format (HEX, rgb, rgba, hsl)
                              </InfoTooltip>
                            </FormLabel>
                            <FormControl>
                              <InputColorPicker
                                disabled={loading}
                                placeholder="#ffffff"
                                field={field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </NonSortable>
          <ResourcesCard
            type="css"
            form={form}
            name="css"
            title="Aditional CSS"
            loading={loading}
          />
        </div>
        <SaveButton form={form} disabled={loading} />
      </form>
    </Form>
  );
};
