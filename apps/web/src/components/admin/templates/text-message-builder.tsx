"use client";

import JsonView from "@uiw/react-json-view";
import { darkTheme } from "@uiw/react-json-view/dark";
import { lightTheme } from "@uiw/react-json-view/light";

import {
  Button,
  cn,
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
  InfoTooltip,
  ScrollArea,
  TextareaMentions,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  useTheme,
} from "@vivid/ui";
import { templateSafeWithError } from "@vivid/utils";
import { Braces, ClipboardCopy } from "lucide-react";
import React from "react";
import { ControllerRenderProps } from "react-hook-form";

type KeyValuePair = { id: string; display: any };
const propertiesToArray = (obj: Record<string, any>) => {
  if (!obj) return [];

  const isObject = (val: any) => !!val && typeof val === "object";

  const addDelimiter = (a: string, b: string) => (a ? `${a}.${b}` : b);

  const paths = (obj: Record<string, any> = {}, head = "") => {
    return Object.entries(obj).reduce((product, [key, value]) => {
      let fullPath = addDelimiter(head, key);
      if (Array.isArray(value)) {
        product.push({ id: fullPath, display: "[]" });
      }

      if (isObject(value)) {
        product.push(...paths(value, fullPath));
      } else {
        product.push({ id: fullPath, display: value.toString() });
      }
      return product;
    }, [] as KeyValuePair[]);
  };

  return paths(obj);
};

export const TextMessageBuilder: React.FC<{
  field: ControllerRenderProps<any>;
  args?: any;
}> = ({ field, args }) => {
  const { resolvedTheme } = useTheme();

  const argsData = args ? propertiesToArray(args) : [];

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <FormItem className="flex-1">
        <FormLabel className="flex flex-row items-center justify-between">
          <span>
            Text message content
            <InfoTooltip>* Uses templated values</InfoTooltip>
          </span>

          <Dialog>
            <Tooltip>
              <TooltipTrigger asChild>
                <DialogTrigger asChild>
                  <Button size="icon" variant="ghost">
                    <Braces size={16} />
                  </Button>
                </DialogTrigger>
              </TooltipTrigger>
              <TooltipContent side="bottom">View context</TooltipContent>
            </Tooltip>
            <DialogContent className="md:max-w-3/5">
              <DialogTitle>Context values</DialogTitle>
              <ScrollArea className="max-h-[60vh]">
                <JsonView
                  value={args || {}}
                  style={resolvedTheme === "dark" ? darkTheme : lightTheme}
                >
                  <JsonView.Copied
                    render={(
                      // @ts-expect-error
                      { "data-copied": copied, onClick, ...props },
                      { value, keyName, keys, parentValue }
                    ) => {
                      const click = (event: React.MouseEvent) => {
                        onClick?.(event as any);
                        const text = (keys || []).join(".");
                        navigator.clipboard.writeText(text);
                      };

                      return (
                        <Tooltip>
                          <TooltipTrigger>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="w-4 h-4 p-0 ml-1"
                              onClick={click}
                            >
                              <ClipboardCopy
                                className={cn(
                                  "w-3 h-3",
                                  copied ? "text-green-600" : ""
                                )}
                              />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            {copied ? "Copied" : "Copy path"}
                          </TooltipContent>
                        </Tooltip>
                      );
                    }}
                  />
                </JsonView>
              </ScrollArea>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="secondary">
                    Close
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </FormLabel>
        <FormControl>
          <TextareaMentions
            trigger="{{"
            data={argsData}
            className="!h-72 max-h-72"
            value={field.value}
            onChange={field.onChange}
            insertTransform={(value) => {
              if (value.display === "[]") {
                return `{{#${value.id}}}{{.}}{{/${value.id}}}`;
              }

              return `{{${value.id}}}`;
            }}
            itemRenderer={(item) => (
              <div className="flex flex-col gap2">
                {item.id}
                <span className="text-xs text-muted-foreground">
                  {item.display}
                </span>
              </div>
            )}
          />
        </FormControl>
        <FormDescription>{field.value?.length || 0} characters</FormDescription>
        <FormMessage />
      </FormItem>
      <FormItem className="flex-1">
        <FormLabel>Preview</FormLabel>
        <div
          className="w-full text-sm"
          dangerouslySetInnerHTML={{
            __html: templateSafeWithError(
              field.value || "",
              args || {}
            ).replaceAll("\n", "<br/>"),
          }}
        />
      </FormItem>
    </div>
  );
};
