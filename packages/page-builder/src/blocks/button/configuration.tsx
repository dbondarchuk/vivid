"use client";

import { ConfigurationProps, PageInput, TextInput } from "@vivid/builder";
import { useI18n } from "@vivid/i18n";
import { Combobox, Label } from "@vivid/ui";
import { StylesConfigurationPanel } from "../../configuration-panel/styles-configuration-panel";
import { ButtonProps, ButtonPropsDefaults } from "./schema";
import { styles } from "./styles";
import { buttonShortcuts } from "./shortcuts";

export const ButtonConfiguration = ({
  data,
  setData,
  base,
  onBaseChange,
}: ConfigurationProps<ButtonProps>) => {
  const t = useI18n("builder");
  const updateData = (d: unknown) => setData(d as ButtonProps);

  const text = data.props?.text ?? ButtonPropsDefaults.props.text;
  const url = data.props?.url ?? ButtonPropsDefaults.props.url;
  const target = data.props?.target ?? ButtonPropsDefaults.props.target;

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
        {/* <TextInput
          label={t("pageBuilder.blocks.button.text")}
          defaultValue={text}
          onChange={(text) =>
            updateData({ ...data, props: { ...data.props, text } })
          }
        /> */}
        <PageInput
          label={t("pageBuilder.blocks.button.url")}
          defaultValue={url}
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
            value={target}
            size="sm"
            className="w-full"
          />
        </div>
      </>
    </StylesConfigurationPanel>
  );
};
