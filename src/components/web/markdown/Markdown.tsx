import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import { MarkdownProps } from "./Markdown.types";
import { cn } from "@/lib/utils";

export const Markdown: React.FC<MarkdownProps> = ({
  markdown,
  className,
  notProse,
}) => {
  return (
    <div
      className={cn(
        !notProse &&
          "[&_p]:py-4 [&_li]:list-inside [&_li]:pl-8 [&_ul_li]:list-disc prose prose-slate",
        className
      )}
    >
      <ReactMarkdown remarkPlugins={[remarkBreaks]}>{markdown}</ReactMarkdown>
    </div>
  );
};
