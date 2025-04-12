import { App } from "@vivid/types";
import { S3_ASSETS_STORAGE_APP_NAME } from "./const";
import { S3Logo } from "./logo";
import { S3AssetsStorageAppSetup } from "./setup";
import image1 from "./images/1.png";
import image2 from "./images/2.png";

export const S3AssetsStorageApp: App = {
  name: S3_ASSETS_STORAGE_APP_NAME,
  displayName: "S3 Assets Storage",
  scope: ["assets-storage"],
  category: ["Storage"],
  type: "basic",
  Logo: ({ className }) => <S3Logo className={className} />,
  SetUp: (props) => <S3AssetsStorageAppSetup {...props} />,
  description: {
    text: `Amazon Simple Storage Service (S3) is a service offered by Amazon Web Services (AWS) that provides object storage through a web service interface.
Also supports any S3 Compatible Storage - a storage solution that allows access to and management of the data it stores over an S3 compliant interface.`,
    images: [image1.src, image2.src],
  },
};
