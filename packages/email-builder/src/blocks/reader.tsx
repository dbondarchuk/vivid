import { ReaderDocumentBlocksDictionary } from "@vivid/builder";
import { Avatar } from "./avatar";
import { Button } from "./button";
import { ColumnsContainerReader } from "./columns-container";
import { ConditionalContainerReader } from "./conditional-container";
import { ContainerReader } from "./container";
import { CustomHTML } from "./custom-html";
import { Divider } from "./divider";
import { EmailLayoutReader } from "./email-layout";
import { ForeachContainerReader } from "./foreach-container";
import { Heading } from "./heading";
import { Image } from "./image";
import { EditorBlocksSchema } from "./schema";
import { Spacer } from "./spacer";
import { TextReader } from "./text";

export const ReaderBlocks: ReaderDocumentBlocksDictionary<
  typeof EditorBlocksSchema
> = {
  Avatar: {
    Reader: Avatar,
  },
  Image: {
    Reader: Image,
  },
  Button: {
    Reader: Button,
  },
  Text: {
    Reader: TextReader,
  },
  Divider: {
    Reader: Divider,
  },
  Spacer: {
    Reader: Spacer,
  },
  EmailLayout: {
    Reader: EmailLayoutReader,
  },
  Heading: {
    Reader: Heading,
  },
  Container: {
    Reader: ContainerReader,
  },
  Columns: {
    Reader: ColumnsContainerReader,
  },
  ConditionalContainer: {
    Reader: ConditionalContainerReader,
  },
  ForeachContainer: {
    Reader: ForeachContainerReader,
  },
  CustomHTML: {
    Reader: CustomHTML,
  },
};
