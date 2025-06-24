"use client";

import { ResourcesCard } from "@/components/admin/resource/resources-card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useI18n } from "@vivid/i18n";
import {
  colors as colorOverrides,
  ColorOverrideSchema,
  colorsLabels,
  fontsNames,
  StylingConfiguration,
  stylingConfigurationSchema,
} from "@vivid/types";
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
  Card,
  CardContent,
  CardHeader,
  cn,
  ColorPickerInput,
  Combobox,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  IComboboxItem,
  InfoTooltip,
  NonSortable,
  SaveButton,
  toastPromise,
} from "@vivid/ui";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { updateStylingConfiguration } from "./actions";

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

const customFontSearch = (search: string) => {
  const lowerSearch = search.toLocaleLowerCase();
  return fontsNames
    .filter((font) => font.toLocaleLowerCase().indexOf(lowerSearch) >= 0)
    .map(fontTransform);
};

export const StylingsConfigurationForm: React.FC<{
  values: StylingConfiguration;
}> = ({ values }) => {
  const t = useI18n("admin");
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
      await toastPromise(
        updateStylingConfiguration({
          ...data,
        }),
        {
          success: t("appearance.styling.form.toasts.changesSaved"),
          error: t("appearance.styling.form.toasts.requestError"),
        }
      );

      router.refresh();
    } catch (error: any) {
      console.error(error);
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
                  <FormLabel>
                    {t("appearance.styling.form.primaryFont")}
                  </FormLabel>
                  <FormControl>
                    <Combobox
                      allowClear
                      values={fonts}
                      disabled={loading}
                      className="flex w-full font-normal text-base"
                      searchLabel={t("appearance.styling.form.selectFont")}
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
                  <FormLabel>
                    {t("appearance.styling.form.secondaryFont")}
                  </FormLabel>
                  <FormControl>
                    <Combobox
                      values={fonts}
                      disabled={loading}
                      className="flex w-full font-normal text-base"
                      searchLabel={t("appearance.styling.form.selectFont")}
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
                  <FormLabel>
                    {t("appearance.styling.form.tertiaryFont")}
                  </FormLabel>
                  <FormControl>
                    <Combobox
                      allowClear
                      values={fonts}
                      disabled={loading}
                      className="flex w-full font-normal text-base"
                      searchLabel={t("appearance.styling.form.selectFont")}
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
            title={t("appearance.styling.form.colorOverrides")}
            ids={colorsIds}
            onAdd={addNewColor}
          >
            <div className="flex flex-grow flex-col gap-4">
              {colors.map((color, index) => {
                const type = form.getValues(`colors.${index}.type`);
                const hasMultipleTypes =
                  (form.getValues("colors") || []).filter(
                    (c) => c.type === type
                  ).length > 1;

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
                        {colorsLabels[type] ||
                          t("appearance.styling.form.invalidField")}
                        {hasMultipleTypes && (
                          <span className="text-sm">
                            {t("appearance.styling.form.duplicateType")}
                          </span>
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
                              title={t("appearance.styling.form.remove")}
                            >
                              <Trash size={20} />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                {t(
                                  "appearance.styling.form.deleteConfirmTitle"
                                )}
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                {t(
                                  "appearance.styling.form.deleteConfirmDescription"
                                )}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>
                                {t("appearance.styling.form.cancel")}
                              </AlertDialogCancel>
                              <AlertDialogAction asChild variant="destructive">
                                <Button onClick={() => removeColor(index)}>
                                  {t("appearance.styling.form.delete")}
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
                            <FormLabel>
                              {t("appearance.styling.form.type")}
                            </FormLabel>
                            <FormControl>
                              <Combobox
                                disabled={loading}
                                className="flex w-full font-normal text-base"
                                values={colorOverrides.map((color) => ({
                                  value: color,
                                  label: colorsLabels[color],
                                }))}
                                searchLabel={t(
                                  "appearance.styling.form.selectColorOverrideType"
                                )}
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
                              {t("appearance.styling.form.color")}{" "}
                              <InfoTooltip>
                                {t("appearance.styling.form.colorTooltip")}
                              </InfoTooltip>
                            </FormLabel>
                            <FormControl>
                              <ColorPickerInput
                                disabled={loading}
                                placeholder="#ffffff"
                                {...field}
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
            title={t("appearance.styling.form.additionalCss")}
            loading={loading}
          />
        </div>
        <SaveButton form={form} disabled={loading} />
      </form>
    </Form>
  );
};
