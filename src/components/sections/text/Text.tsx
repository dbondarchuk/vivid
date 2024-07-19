import { Markdown } from "@/components/markdown/Markdown";
import { cn } from "@/lib/utils";
import { TextSection as TextSectionProps } from "./Text.types";

export const TextSection: React.FC<TextSectionProps> = ({
  text,
  className,
  id,
}) => {
  return (
    <section className={cn("w-full scroll-m-20 appear", className)} id={id}>
      <Markdown markdown={text} />
    </section>
  );
};
