import { App } from "@vivid/types";
import { FILE_SYSTEM_ASSETS_STORAGE_APP_NAME } from "./fileSystemAssetsStorage.const";
import { Folder } from "lucide-react";

export const FileSystemAssetsStorageApp: App = {
  name: FILE_SYSTEM_ASSETS_STORAGE_APP_NAME,
  displayName: "File system assets storage",
  scope: ["assets-storage"],
  type: "system",
  category: ["Storage"],
  Logo: ({ className }) => <Folder className={className} />,
  dontAllowMultiple: true,
  isHidden: true,
  description: {
    text: "Store assets in file system.",
  },
};
