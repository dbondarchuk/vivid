"use client";
import { ConfigurationProps } from "@vivid/builder";
import { useI18n } from "@vivid/i18n";
import { UploadedFile } from "@vivid/types";
import { AssetSelectorDialog, ToolbarButton } from "@vivid/ui";
import { Image } from "lucide-react";
import { useState } from "react";
import { ShortcutsToolbar } from "../../toolbars/shortucts";
import { ImageProps } from "./schema";
import { imageShortcuts } from "./shortcuts";

export const ImageToolbar = (props: ConfigurationProps<ImageProps>) => {
  const [isOpen, setIsOpen] = useState(false);
  const t = useI18n("builder");

  const handleAssetSelected = (asset: UploadedFile) => {
    props.setData({
      ...props.data,
      props: { ...props.data.props, src: asset.url },
    });
    setIsOpen(false);
  };

  return (
    <>
      <ShortcutsToolbar
        shortcuts={imageShortcuts}
        data={props.data}
        setData={props.setData}
      />
      <ToolbarButton
        tooltip={t("pageBuilder.blocks.image.imageUrl")}
        className="text-xs"
        onClick={() => setIsOpen(true)}
      >
        <Image className="size-4" />
      </ToolbarButton>
      <AssetSelectorDialog
        accept={["image/*"]}
        isOpen={isOpen}
        close={() => setIsOpen(false)}
        onSelected={handleAssetSelected}
      />
    </>
  );
};
