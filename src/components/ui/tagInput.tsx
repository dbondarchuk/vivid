"use client";

import { forwardRef, useEffect, useState } from "react";
import { Option, pipe, String, Array as EArray } from "effect";
import { XIcon } from "lucide-react";
import type { z } from "zod";

import { Badge } from "./badge";
import { Button } from ".//button";
import { cn } from "@/lib/utils";
import type { InputProps } from "./input";

const parseTagOpt = (params: { tag: string; tagValidator: z.ZodString }) => {
  const { tag, tagValidator } = params;

  const parsedTag = tagValidator.safeParse(tag);

  if (parsedTag.success) {
    return pipe(parsedTag.data, Option.some);
  }

  return Option.none();
};

type TagInputProps = Omit<InputProps, "value" | "onChange"> & {
  value?: ReadonlyArray<string>;
  onChange: (value: ReadonlyArray<string>) => void;
  tagValidator?: z.ZodString;
};

const TagInput = forwardRef<HTMLInputElement, TagInputProps>((props, ref) => {
  const { className, value = [], onChange, tagValidator, ...domProps } = props;

  const [pendingDataPoint, setPendingDataPoint] = useState("");

  useEffect(() => {
    if (pendingDataPoint.includes(",")) {
      const newDataPoints = new Set([
        ...value,
        ...pipe(
          pendingDataPoint,
          String.split(","),
          EArray.filterMap((x) => {
            const trimmedX = pipe(x, String.trim);

            return pipe(
              tagValidator,
              Option.fromNullable,
              Option.match({
                onNone: () => pipe(trimmedX, Option.some),
                onSome: (y) => parseTagOpt({ tag: trimmedX, tagValidator: y }),
              })
            );
          })
        ),
      ]);
      onChange(Array.from(newDataPoints));
      setPendingDataPoint("");
    }
  }, [pendingDataPoint, onChange, value, tagValidator]);

  const addPendingDataPoint = () => {
    if (pendingDataPoint) {
      pipe(
        tagValidator,
        Option.fromNullable,
        Option.match({
          onNone: () => {
            const newDataPoints = new Set([...value, pendingDataPoint]);
            onChange(Array.from(newDataPoints));
            setPendingDataPoint("");
          },
          onSome: (y) =>
            pipe(
              parseTagOpt({ tag: pendingDataPoint, tagValidator: y }),
              Option.match({
                onNone: () => {},
                onSome: (x) => {
                  const newDataPoints = new Set([...value, x]);
                  onChange(Array.from(newDataPoints));
                  setPendingDataPoint("");
                },
              })
            ),
        })
      );
    }
  };

  return (
    <div
      className={cn(
        // caveat: :has() variant requires tailwind v3.4 or above: https://tailwindcss.com/blog/tailwindcss-v3-4#new-has-variant
        "has-[:focus-visible]:ring-neutral-950 dark:has-[:focus-visible]:ring-neutral-300 border-neutral-200 dark:border-neutral-800 dark:bg-neutral-950 dark:ring-offset-neutral-950 flex min-h-10 w-full flex-wrap gap-2 rounded-md border bg-white px-3 py-2 text-sm ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 has-[:focus-visible]:outline-none has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-offset-2",
        className
      )}
    >
      {value.map((item) => (
        <Badge key={item} variant={"secondary"}>
          {item}
          <Button
            variant={"ghost"}
            size={"icon"}
            className={"ml-2 h-3 w-3"}
            onClick={() => {
              onChange(value.filter((i) => i !== item));
            }}
          >
            <XIcon className={"w-3"} />
          </Button>
        </Badge>
      ))}
      <input
        className={
          "placeholder:text-neutral-500 dark:placeholder:text-neutral-400 flex-1 outline-none"
        }
        value={pendingDataPoint}
        onChange={(e) => setPendingDataPoint(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            addPendingDataPoint();
          } else if (
            e.key === "Backspace" &&
            pendingDataPoint.length === 0 &&
            value.length > 0
          ) {
            e.preventDefault();
            onChange(value.slice(0, -1));
          }
        }}
        {...domProps}
        ref={ref}
      />
    </div>
  );
});

TagInput.displayName = "TagInput";

export { TagInput };
