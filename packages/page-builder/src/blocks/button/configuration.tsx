"use client";

import {
  ConfigurationProps,
  PageInput,
  SelectInput,
  TextInput,
} from "@vivid/builder";
import { useI18n } from "@vivid/i18n";
import { Combobox, Label } from "@vivid/ui";
import { StylesConfigurationPanel } from "../../configuration-panel/styles-configuration-panel";
import {
  ButtonDefaultAction,
  ButtonDefaultTarget,
  ButtonDefaultUrl,
  ButtonProps,
} from "./schema";
import { buttonShortcuts } from "./shortcuts";
import { styles } from "./styles";

export const ButtonConfiguration = ({
  data,
  setData,
  base,
  onBaseChange,
}: ConfigurationProps<ButtonProps>) => {
  const t = useI18n("builder");
  const updateData = (d: unknown) => setData(d as ButtonProps);

  const url =
    data.props?.type === "link"
      ? (data.props.url ?? ButtonDefaultUrl)
      : undefined;
  const target =
    data.props?.type === "link"
      ? (data.props.target ?? ButtonDefaultTarget)
      : undefined;

  const type = data.props?.type ?? "link";
  const action =
    data.props?.type === "action"
      ? (data.props.action ?? ButtonDefaultAction)
      : undefined;
  const actionData =
    data.props?.type === "action" ? data.props.actionData : undefined;

  return (
    <StylesConfigurationPanel
      styles={data.style ?? {}}
      onStylesChange={(style) => updateData({ ...data, style })}
      availableStyles={styles}
      shortcuts={buttonShortcuts}
      base={base}
      onBaseChange={onBaseChange}
    >
      <>
        <SelectInput
          label={t("pageBuilder.blocks.button.type")}
          options={[
            { value: "link", label: t("pageBuilder.blocks.button.types.link") },
            {
              value: "action",
              label: t("pageBuilder.blocks.button.types.action"),
            },
          ]}
          defaultValue={type}
          onChange={(type) =>
            updateData({
              ...data,
              props: {
                ...data.props,
                type,
                action: type === "action" ? ButtonDefaultAction : undefined,
                actionData: undefined,
              },
            })
          }
        />
        {type === "link" && (
          <>
            <PageInput
              label={t("pageBuilder.blocks.button.url")}
              defaultValue={url ?? ButtonDefaultUrl}
              onChange={(url) =>
                updateData({ ...data, props: { ...data.props, url } })
              }
            />
            <div className="flex flex-col gap-2">
              <Label>{t("pageBuilder.blocks.button.target")}</Label>
              <Combobox
                values={[
                  {
                    value: "_self",
                    label: t("pageBuilder.blocks.button.targets._self"),
                  },
                  {
                    value: "_blank",
                    label: t("pageBuilder.blocks.button.targets._blank"),
                  },
                ]}
                value={target ?? ButtonDefaultTarget}
                size="sm"
                className="w-full"
                onItemSelect={(value) =>
                  updateData({
                    ...data,
                    props: { ...data.props, target: value },
                  })
                }
              />
            </div>
          </>
        )}
        {type === "action" && (
          <>
            <SelectInput
              label={t("pageBuilder.blocks.button.action")}
              options={[
                {
                  value: "open-popup",
                  label: t("pageBuilder.blocks.button.actions.openPopup.label"),
                },
                {
                  value: "close-current-popup",
                  label: t(
                    "pageBuilder.blocks.button.actions.closeCurrentPopup.label"
                  ),
                },
              ]}
              defaultValue={action ?? ButtonDefaultAction}
              onChange={(action) =>
                updateData({ ...data, props: { ...data.props, action } })
              }
            />
            {action === "open-popup" && (
              <TextInput
                label={t("pageBuilder.blocks.button.actions.openPopup.popupId")}
                defaultValue={actionData?.popupId}
                helperText={t(
                  "pageBuilder.blocks.button.actions.openPopup.helperText"
                )}
                onChange={(popupId) =>
                  updateData({
                    ...data,
                    props: { ...data.props, actionData: { popupId } },
                  })
                }
              />
            )}
          </>
        )}
      </>
    </StylesConfigurationPanel>
  );
};
