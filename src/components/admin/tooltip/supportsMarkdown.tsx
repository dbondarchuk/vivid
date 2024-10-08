import { Link } from "@/components/ui/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CodeSquare, Info } from "lucide-react";
import React from "react";

export type SupportsMarkdownTooltipProps = {
  supportsMdx?: boolean;
};

export const SupportsMarkdownTooltip: React.FC<
  SupportsMarkdownTooltipProps
> = ({ supportsMdx }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger className="align-top ml-1" type="button">
          <CodeSquare className="w-3 h-3" />
        </TooltipTrigger>
        <TooltipContent className="pt-2">
          <p>This field supports {supportsMdx ? "MDX" : "Markdown"}</p>
          <p>
            <Link
              variant="dashed"
              target="_blank"
              href={
                supportsMdx
                  ? "https://mdxjs.com/docs/what-is-mdx/"
                  : "https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax"
              }
            >
              Learn more
            </Link>
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
