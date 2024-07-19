import { Markdown } from "@/components/markdown/Markdown";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import React from "react";
import { PageHeroSection as PageHeroSectionProps } from "./PageHero.types";

export const PageHeroSection: React.FC<PageHeroSectionProps> = ({
  title,
  subtitle,
  description,
  backgroundImage,
  cta,
  id,
  className,
}) => {
  return (
    <section
      style={{
        // @ts-ignore setting variable in css
        "--image-url": backgroundImage ? `url(${backgroundImage})` : "",
      }}
      className={cn(
        "w-full bg-white bg-opacity-50 bg-[image:var(--image-url)] bg-cover bg-no-repeat bg-blend-overlay p-[6vw] appear rounded-lg",
        className
      )}
      id={id}
    >
      <div className="py-[10vmax]  flex flex-col items-center gap-10 text-center">
        {subtitle && (
          <h2 className="font-body font-light text-2xl p">
            <Markdown className="uppercase" markdown={subtitle} />
          </h2>
        )}
        <h1 className="font-header font-semibold text-[4rem] md:text-6xl py-10">
          {title}
        </h1>
        {description && (
          <Markdown className="uppercase" markdown={description} />
        )}
        {cta && (
          <div>
            <Button
              variant="primary"
              className="bg-transparent font-medium text-xl hover:animate-bounce"
              asChild
            >
              <a href={cta.link}>{cta.text}</a>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};
