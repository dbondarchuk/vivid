import {
  BaseZodDictionary,
  TReaderProps,
  renderToStaticMarkup as baseRenderToStaticMarkup,
} from "@vivid/builder";
import { ReaderBlocks } from "./blocks/reader";

export async function renderToStaticMarkup<T extends BaseZodDictionary>(
  props: Omit<TReaderProps<T>, "blocks">
) {
  return await baseRenderToStaticMarkup({
    ...props,
    blocks: ReaderBlocks,
  });
}
