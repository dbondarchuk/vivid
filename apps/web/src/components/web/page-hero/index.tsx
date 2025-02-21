import { Button, cn } from "@vivid/ui";
import React from "react";
import { PageHeroSection as PageHeroSectionProps } from "./types";

export const PageHero: React.FC<PageHeroSectionProps> = ({
  title,
  subtitle,
  description,
  backgroundImage,
  cta,
  className,
  style = {},
  variant = "background",
  ...props
}) => {
  return (
    <section
      style={{
        // @ts-ignore setting variable in css
        "--image-url":
          backgroundImage && variant === "background"
            ? `url(${backgroundImage})`
            : "",
        ...style,
      }}
      className={cn(
        "w-full bg-white bg-opacity-50 bg-[image:var(--image-url)] bg-cover bg-no-repeat bg-blend-overlay p-[6vw] appear rounded-lg",
        variant !== "background" &&
          "flex flex-col md:flex-row gap-2 items-center",
        variant === "imageLeft" && "flex-col-reverse md:flex-row-reverse",
        className
      )}
      {...props}
    >
      <div className="py-[10vmax] flex flex-col items-center gap-10 text-center flex-1">
        {subtitle && (
          <h2 className="font-primary font-normal text-3xl p">{subtitle}</h2>
        )}
        <h1 className="font-secondary font-semibold text-5xl py-10">{title}</h1>
        {description}
        {cta && (
          <div className="flex flex-row gap-2">
            {cta.map((button, index) => (
              <Button
                key={index}
                variant={button.variant || "primary"}
                className={cn("font-medium text-xl", button.className)}
                asChild
              >
                <a href={button.link}>{button.text}</a>
              </Button>
            ))}
          </div>
        )}
      </div>
      {variant !== "background" && (
        <div
          style={{
            // @ts-ignore setting variable in css
            "--image-url": backgroundImage ? `url(${backgroundImage})` : "",
          }}
          className={cn(
            "w-full  bg-[image:var(--image-url)] bg-contain bg-no-repeat bg-center bg-blend-overlay p-[6vw] appear rounded-lg flex-1"
          )}
        />
      )}
    </section>
  );
};
