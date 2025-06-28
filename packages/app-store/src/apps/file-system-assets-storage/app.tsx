import { App } from "@vivid/types";
import { FILE_SYSTEM_ASSETS_STORAGE_APP_NAME } from "./const";
import { Folder } from "lucide-react";

export const FileSystemAssetsStorageApp: App = {
  name: FILE_SYSTEM_ASSETS_STORAGE_APP_NAME,
  displayName: "fileSystemAssetsStorage.displayName",
  scope: ["assets-storage"],
  type: "system",
  category: ["categories.storage"],
  Logo: ({ className }) => <Folder className={className} />,
  dontAllowMultiple: true,
  isHidden: true,
  description: {
    text: "fileSystemAssetsStorage.description",
  },
};
