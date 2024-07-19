import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import { twMerge } from "tailwind-merge";
import { MarkdownProps } from "./Markdown.types";

export const Markdown: React.FC<MarkdownProps> = ({ markdown, className }) => {
  return (
    <div
      className={twMerge(
        "[&_p]:py-4 [&_li]:list-inside [&_li]:pl-8 [&_ul_li]:list-disc font-extralight prose prose-slate",
        className
      )}
    >
      <ReactMarkdown remarkPlugins={[remarkBreaks]}>{markdown}</ReactMarkdown>
    </div>
  );
};
