"use client";

import { ConfigurationProps, FileInput, SelectInput } from "@vivid/builder";
import { useI18n } from "@vivid/i18n";
import { Checkbox, Label } from "@vivid/ui";
import { StylesConfigurationPanel } from "../../configuration-panel/styles-configuration-panel";
import { VideoProps } from "./schema";
import { videoShortcuts } from "./shortcuts";
import { styles } from "./styles";

export const VideoConfiguration = ({
  data,
  setData,
  base,
  onBaseChange,
}: ConfigurationProps<VideoProps>) => {
  const updateData = (d: unknown) => setData(d as VideoProps);
  const t = useI18n("builder");

  return (
    <StylesConfigurationPanel
      styles={data.style ?? {}}
      onStylesChange={(style) => updateData({ ...data, style })}
      availableStyles={styles}
      shortcuts={videoShortcuts}
      props={data.props}
      onPropsChange={(props) => updateData({ ...data, props })}
      base={base}
      onBaseChange={onBaseChange}
    >
      <FileInput
        label={t("pageBuilder.blocks.video.videoUrl")}
        accept="video/*"
        defaultValue={data.props?.src ?? ""}
        onChange={(v) => {
          const src = v.trim().length === 0 ? null : v.trim();
          updateData({ ...data, props: { ...data.props, src } });
        }}
      />

      <FileInput
        label={t("pageBuilder.blocks.video.posterUrl")}
        accept="image/*"
        defaultValue={data.props?.poster ?? ""}
        onChange={(v) => {
          const poster = v.trim().length === 0 ? null : v.trim();
          updateData({ ...data, props: { ...data.props, poster } });
        }}
      />

      <SelectInput
        label={t("pageBuilder.blocks.video.preload")}
        options={[
          {
            value: "none",
            label: t("pageBuilder.blocks.video.preloadOptions.none"),
          },
          {
            value: "metadata",
            label: t("pageBuilder.blocks.video.preloadOptions.metadata"),
          },
          {
            value: "auto",
            label: t("pageBuilder.blocks.video.preloadOptions.auto"),
          },
        ]}
        defaultValue={data.props?.preload ?? "metadata"}
        onChange={(v) => {
          updateData({ ...data, props: { ...data.props, preload: v } });
        }}
      />

      <div className="space-y-4">
        <div className="flex items-center gap-2 flex-1">
          <Checkbox
            id="controls"
            checked={!!data.props?.controls}
            onCheckedChange={(controls) =>
              updateData({ ...data, props: { ...data.props, controls } })
            }
          />
          <Label htmlFor="controls">
            {t("pageBuilder.blocks.video.controls")}
          </Label>
        </div>

        <div className="flex items-center gap-2 flex-1">
          <Checkbox
            id="autoplay"
            checked={!!data.props?.autoplay}
            onCheckedChange={(autoplay) =>
              updateData({ ...data, props: { ...data.props, autoplay } })
            }
          />
          <Label htmlFor="autoplay">
            {t("pageBuilder.blocks.video.autoplay")}
          </Label>
        </div>

        <div className="flex items-center gap-2 flex-1">
          <Checkbox
            id="loop"
            checked={!!data.props?.loop}
            onCheckedChange={(loop) =>
              updateData({ ...data, props: { ...data.props, loop } })
            }
          />
          <Label htmlFor="loop">{t("pageBuilder.blocks.video.loop")}</Label>
        </div>

        <div className="flex items-center gap-2 flex-1">
          <Checkbox
            id="muted"
            checked={!!data.props?.muted}
            onCheckedChange={(muted) =>
              updateData({ ...data, props: { ...data.props, muted } })
            }
          />
          <Label htmlFor="muted">{t("pageBuilder.blocks.video.muted")}</Label>
        </div>
      </div>
    </StylesConfigurationPanel>
  );
};
