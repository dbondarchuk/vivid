import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import { MarkdownProps } from "./Markdown.types";
import clsx from "clsx";

export const Markdown: React.FC<MarkdownProps> = ({ markdown, className }) => {
  return (
    <div
      className={clsx(
        "[&_p]:py-4 [&_li]:list-inside [&_li]:pl-8 [&_ul_li]:list-disc font-extralight prose prose-slate",
        className
      )}
    >
      <ReactMarkdown remarkPlugins={[remarkBreaks]}>{markdown}</ReactMarkdown>
    </div>
  );
};
