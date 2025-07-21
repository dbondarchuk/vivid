"use client";

import { ConfigurationProps, PageInput } from "@vivid/builder";
import { useI18n } from "@vivid/i18n";
import { Combobox, Label } from "@vivid/ui";
import { StylesConfigurationPanel } from "../../configuration-panel/styles-configuration-panel";
import { ButtonDefaultTarget, ButtonDefaultUrl, ButtonProps } from "./schema";
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

  const url = data.props?.url ?? ButtonDefaultUrl;
  const target = data.props?.target ?? ButtonDefaultTarget;

  // // Create icon options for the combobox
  // const iconOptions = Object.keys(icons).map((iconName) => ({
  //   value: iconName,
  //   label: (
  //     <div className="flex flex-row gap-2 items-center">
  //       {/* @ts-expect-error - icons is a dynamic object */}
  //       {createElement(icons[iconName], { size: 16 })}
  //       <span>{iconName}</span>
  //     </div>
  //   ),
  // }));

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
            onItemSelect={(value) =>
              updateData({ ...data, props: { ...data.props, target: value } })
            }
          />
        </div>
        {/* <div className="flex flex-col gap-2">
          <Label>{t("pageBuilder.blocks.button.prefixIcon")}</Label>
          <Combobox
            values={[
              { value: "", label: t("pageBuilder.blocks.button.noIcon") },
              ...iconOptions,
            ]}
            value={prefixIcon ?? ""}
            size="sm"
            className="w-full"
            onItemSelect={(value) =>
              updateData({
                ...data,
                props: {
                  ...data.props,
                  prefixIcon: value === "" ? null : value,
                },
              })
            }
          />
        </div> */}
      </>
    </StylesConfigurationPanel>
  );
};
