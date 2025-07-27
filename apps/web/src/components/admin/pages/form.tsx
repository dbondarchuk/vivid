"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Language, useI18n } from "@vivid/i18n";
import { PageBuilder } from "@vivid/page-builder";
import { PageReader } from "@vivid/page-builder/reader";
import {
  GeneralConfiguration,
  getPageSchemaWithUniqueCheck,
  Page,
  PageFooter,
  PageHeader,
  SocialConfiguration,
} from "@vivid/types";
import {
  Breadcrumbs,
  cn,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Input,
  InputGroup,
  InputGroupInput,
  InputGroupInputClasses,
  InputGroupSuffixClasses,
  InputSuffix,
  Link,
  SaveButton,
  toastPromise,
  useDebounceCacheFn,
  useDemoArguments,
} from "@vivid/ui";
import { Globe, Settings as SettingsIcon } from "lucide-react";
import { useNavigationGuard } from "next-navigation-guard";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm, useFormState } from "react-hook-form";
import { z } from "zod";
import { NavigationGuardDialog, useIsDirty } from "../navigation-guard/dialog";
import { checkUniqueSlug, createPage, updatePage } from "./actions";
import { PageSettingsPanel } from "./page-settings-panel";
import { formatArguments } from "@vivid/utils";

// Helper function to generate slug from title
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters except spaces and hyphens
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
};

export const PageForm: React.FC<{
  initialData?: Page;
  config: {
    general: GeneralConfiguration;
    social: SocialConfiguration;
  };
}> = ({ initialData, config }) => {
  const t = useI18n("admin");

  const isDirty = React.useRef(false);

  const cachedUniqueSlugCheck = useDebounceCacheFn(checkUniqueSlug, 300);

  const formSchema = React.useMemo(
    () =>
      getPageSchemaWithUniqueCheck(
        (slug) => cachedUniqueSlugCheck(slug, initialData?._id),
        "page.slug.unique"
      ),
    [cachedUniqueSlugCheck, initialData?._id]
  );

  type PageFormValues = z.infer<typeof formSchema>;
  // Remove old style content
  if (typeof initialData?.content === "string") {
    initialData.content = undefined;
  }

  const [loading, setLoading] = React.useState(false);
  const [slugManuallyChanged, setSlugManuallyChanged] = React.useState(false);
  const router = useRouter();
  const form = useForm<PageFormValues>({
    resolver: zodResolver(formSchema),
    mode: "all",
    reValidateMode: "onChange",
    defaultValues: initialData || {
      publishDate: new Date(),
      published: true,
    },
  });

  const slug = form.watch("slug");
  const title = form.watch("title");
  const language = form.watch("language");
  const isNewPage = !initialData;

  // Auto-generate slug when title changes (only for new pages and when slug hasn't been manually changed)
  React.useEffect(() => {
    if (isNewPage && !slugManuallyChanged && title) {
      const generatedSlug = generateSlug(title);
      if (generatedSlug && generatedSlug !== slug) {
        form.setValue("slug", generatedSlug);
        form.trigger("slug");
      }
    }
  }, [title, isNewPage, slugManuallyChanged, slug, form]);

  const breadcrumbItems = [
    { title: t("assets.dashboard"), link: "/admin/dashboard" },
    { title: t("pages.title"), link: "/admin/dashboard/pages" },
    {
      title: title || t("pages.new"),
      link: initialData?._id
        ? `/admin/dashboard/pages/${initialData._id}`
        : "/admin/dashboard/pages/new",
    },
  ];

  const { setError, trigger } = form;
  const onPageBuilderValidChange = React.useCallback(
    (isValid: boolean) =>
      isValid
        ? trigger()
        : setError("content", {
            message: t("templates.form.validation.templateNotValid"),
          }),
    [setError, trigger, t]
  );

  const { isFormDirty, onFormSubmit } = useIsDirty(form);

  const onSubmit = async (data: PageFormValues) => {
    try {
      setLoading(true);

      const fn = async () => {
        if (data.language === ("default" as Language)) {
          data.language = undefined;
        }

        if (!initialData) {
          const { _id } = await createPage(data);
          onFormSubmit();

          setTimeout(() => {
            router.push(`/admin/dashboard/pages/${_id}`);
          }, 100);
        } else {
          await updatePage(initialData._id, data);
          onFormSubmit();

          setTimeout(() => {
            router.refresh();
          }, 100);
        }
      };

      await toastPromise(fn(), {
        success: t("pages.toasts.changesSaved"),
        error: t("common.toasts.error"),
      });
    } catch (error: any) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const { content: _, ...restFields } = form.watch();
  const demoAppointment = useDemoArguments();
  const args = formatArguments(
    {
      ...restFields,
      appointment: demoAppointment,
      social: config.social,
      general: config.general,
      now: new Date(),
    },
    language || config.general.language
  );

  // Determine if any settings fields have errors
  const nonSettingsFields = ["title", "slug", "content"];

  const { errors } = useFormState({ control: form.control });
  const hasSettingsErrors = Object.keys(errors).some(
    (error) => !nonSettingsFields.includes(error)
  );

  const headerId = form.watch("headerId");
  const footerId = form.watch("footerId");

  const [header, setHeader] = React.useState<PageHeader | null>(null);
  React.useEffect(() => {
    const fetchHeader = async () => {
      const response = await fetch(`/admin/api/pages/headers/${headerId}`);
      const data = await response.json();
      setHeader(data);
    };

    if (headerId) {
      fetchHeader();
    } else {
      setHeader(null);
    }
  }, [headerId]);

  const [footer, setFooter] = React.useState<PageFooter | null>(null);
  React.useEffect(() => {
    const fetchFooter = async () => {
      const response = await fetch(`/admin/api/pages/footers/${footerId}`);
      const data = await response.json();
      setFooter(data);
    };

    if (footerId) {
      fetchFooter();
    } else {
      setFooter(null);
    }
  }, [footerId]);

  return (
    <Form {...form}>
      <NavigationGuardDialog isDirty={isFormDirty} />
      <div className="flex flex-1 flex-col gap-4">
        <div className="flex flex-col gap-4 justify-between">
          <Breadcrumbs items={breadcrumbItems} />
          <div className="flex flex-col-reverse md:flex-row md:items-center justify-between gap-4">
            {/* <Heading title={t("pages.edit")} description={`/${slug}`} /> */}
            <div className="flex flex-col gap-2 w-full">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input
                        className="md:text-xl lg:text-2xl font-bold tracking-tight border-0 w-full"
                        autoFocus
                        h={"lg"}
                        disabled={loading}
                        placeholder={t("pages.form.titlePlaceholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <InputGroup>
                        <InputSuffix
                          className={cn(
                            InputGroupSuffixClasses({
                              variant: "prefix",
                              h: "sm",
                            }),
                            "border-0 pt-2.5"
                          )}
                        >
                          <span className="text-sm text-muted-foreground">
                            /
                          </span>
                        </InputSuffix>
                        <InputGroupInput>
                          <Input
                            className={cn(
                              "text-sm text-muted-foreground",
                              InputGroupInputClasses({ variant: "prefix" }),
                              "pl-0.5 border-0"
                            )}
                            h="sm"
                            disabled={
                              loading || (!isNewPage && slug === "home")
                            }
                            placeholder={t("pages.form.pageSlugPlaceholder")}
                            onChange={(e) => {
                              field.onChange(e);
                              setSlugManuallyChanged(true);
                            }}
                            value={field.value}
                          />
                        </InputGroupInput>
                      </InputGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {initialData?.slug && (
              <Link
                button
                href={`/${initialData.slug}?preview=true`}
                variant="default"
                target="_blank"
              >
                <Globe className="mr-2 h-4 w-4" /> {t("pages.viewPage")}
              </Link>
            )}
          </div>
          {/* <Separator /> */}
        </div>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-8"
        >
          <div className="flex flex-col-reverse lg:flex-row gap-4 w-full">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem className="w-full flex-grow relative">
                  <FormControl>
                    <PageBuilder
                      args={args}
                      value={field.value}
                      onIsValidChange={onPageBuilderValidChange}
                      onChange={(value) => {
                        field.onChange(value);
                      }}
                      header={
                        header
                          ? {
                              config: header,
                              name: config.general.name,
                              logo: config.general.logo,
                            }
                          : undefined
                      }
                      footer={
                        footer?.content ? (
                          <PageReader document={footer.content} args={args} />
                        ) : undefined
                      }
                      extraTabs={[
                        {
                          value: "page-settings",
                          label: (
                            <span
                              className={cn(
                                hasSettingsErrors && "text-destructive"
                              )}
                            >
                              {t("pages.form.settingsTabLabel")}
                            </span>
                          ),
                          icon: <SettingsIcon size={16} />,
                          content: (
                            <PageSettingsPanel form={form} loading={loading} />
                          ),
                        },
                      ]}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <SaveButton form={form} ignoreDirty />
        </form>
      </div>
    </Form>
  );
};
