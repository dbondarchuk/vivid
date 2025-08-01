"use client";

import {
  ConfigurationProps,
  PageInput,
  SelectInput,
  TextInput,
} from "@vivid/builder";
import { useI18n } from "@vivid/i18n";
import { Combobox, deepMemo, Label } from "@vivid/ui";
import { useCallback } from "react";
import { StylesConfigurationPanel } from "../../configuration-panel/styles-configuration-panel";
import {
  ButtonDefaultAction,
  ButtonDefaultTarget,
  ButtonDefaultUrl,
  ButtonProps,
} from "./schema";
import { buttonShortcuts } from "./shortcuts";
import { styles } from "./styles";

export const ButtonConfiguration = deepMemo(
  ({ data, setData, base, onBaseChange }: ConfigurationProps<ButtonProps>) => {
    const t = useI18n("builder");
    const updateProps = useCallback(
      (p: unknown) => setData({ ...data, props: p as ButtonProps["props"] }),
      [setData, data]
    );
    const updateStyle = useCallback(
      (s: unknown) => setData({ ...data, style: s as ButtonProps["style"] }),
      [setData, data]
    );

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
        onStylesChange={updateStyle}
        availableStyles={styles}
        shortcuts={buttonShortcuts}
        base={base}
        onBaseChange={onBaseChange}
      >
        <>
          <SelectInput
            label={t("pageBuilder.blocks.button.type")}
            options={[
              {
                value: "link",
                label: t("pageBuilder.blocks.button.types.link"),
              },
              {
                value: "action",
                label: t("pageBuilder.blocks.button.types.action"),
              },
            ]}
            defaultValue={type}
            onChange={(type) => updateProps({ ...data.props, type })}
          />
          {type === "link" && (
            <>
              <PageInput
                label={t("pageBuilder.blocks.button.url")}
                defaultValue={url ?? ButtonDefaultUrl}
                onChange={(url) => updateProps({ ...data.props, url })}
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
                    updateProps({ ...data.props, target: value })
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
                    label: t(
                      "pageBuilder.blocks.button.actions.openPopup.label"
                    ),
                  },
                  {
                    value: "close-current-popup",
                    label: t(
                      "pageBuilder.blocks.button.actions.closeCurrentPopup.label"
                    ),
                  },
                ]}
                defaultValue={action ?? ButtonDefaultAction}
                onChange={(action) => updateProps({ ...data.props, action })}
              />
              {action === "open-popup" && (
                <TextInput
                  label={t(
                    "pageBuilder.blocks.button.actions.openPopup.popupId"
                  )}
                  defaultValue={actionData?.popupId}
                  helperText={t(
                    "pageBuilder.blocks.button.actions.openPopup.helperText"
                  )}
                  onChange={(popupId) =>
                    updateProps({ ...data.props, actionData: { popupId } })
                  }
                />
              )}
            </>
          )}
        </>
      </StylesConfigurationPanel>
    );
  }
);
