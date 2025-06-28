import { App } from "@vivid/types";
import { S3_ASSETS_STORAGE_APP_NAME } from "./const";
import { S3Logo } from "./logo";
import { S3AssetsStorageAppSetup } from "./setup";
import image1 from "./images/1.png";
import image2 from "./images/2.png";

export const S3AssetsStorageApp: App = {
  name: S3_ASSETS_STORAGE_APP_NAME,
  displayName: "s3AssetsStorage.displayName",
  scope: ["assets-storage"],
  category: ["categories.storage"],
  type: "basic",
  Logo: ({ className }) => <S3Logo className={className} />,
  SetUp: (props) => <S3AssetsStorageAppSetup {...props} />,
  description: {
    text: "s3AssetsStorage.description",
    images: [image1.src, image2.src],
  },
};
