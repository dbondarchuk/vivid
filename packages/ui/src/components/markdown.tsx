import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import { cn } from "@vivid/ui";

export type MarkdownProps = {
  markdown: string;
  className?: string;
  prose?: "prose" | "none" | "simple";
};

export const Markdown: React.FC<MarkdownProps> = ({
  markdown,
  className,
  prose = "prose",
}) => {
  return (
    <div
      className={cn(
        "text-foreground text-[var(--value-foreground-color)]",
        prose === "prose" &&
          "[&_p]:py-4 [&_li]:list-inside [&_li]:pl-8 [&_ul_li]:list-disc prose prose-slate",
        prose === "simple" && "prose prose-slate",
        className
      )}
    >
      <ReactMarkdown remarkPlugins={[remarkBreaks]}>{markdown}</ReactMarkdown>
    </div>
  );
};
