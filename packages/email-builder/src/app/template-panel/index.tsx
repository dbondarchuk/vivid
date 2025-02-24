import EditorBlock from "../../documents/editor/block";
import {
  setSelectedScreenSize,
  useDocument,
  useSelectedScreenSize,
} from "../../documents/editor/context";

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
  ScrollArea,
  SidebarTrigger,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  useTheme,
} from "@vivid/ui";
import {
  Braces,
  ClipboardCopy,
  Eye,
  Monitor,
  Pencil,
  Smartphone,
} from "lucide-react";
import { Reader } from "../../documents/reader/block";

type TemplatePanelProps = {
  args?: Record<string, any>;
};

export default function TemplatePanel({ args }: TemplatePanelProps) {
  const document = useDocument();
  const selectedScreenSize = useSelectedScreenSize();
  const { resolvedTheme } = useTheme();

  let mainBoxSx: any = {
    height: "100%",
  };
  if (selectedScreenSize === "mobile") {
    mainBoxSx = {
      ...mainBoxSx,
      margin: "32px auto",
      width: 370,
      height: 800,
      boxShadow:
        "rgba(33, 36, 67, 0.04) 0px 10px 20px, rgba(33, 36, 67, 0.04) 0px 2px 6px, rgba(33, 36, 67, 0.04) 0px 0px 1px",
    };
  }

  const handleScreenSizeChange = (value: string) => {
    switch (value) {
      case "mobile":
      case "desktop":
        setSelectedScreenSize(value);
        return;
      default:
        setSelectedScreenSize("desktop");
    }
  };

  return (
    <>
      <Tabs defaultValue="editor">
        <div className="flex flex-row justify-between items-center pb-4 w-full border-b border-secondary bg-background sticky top-0 z-[45] p-1">
          <TabsList className="">
            <TabsTrigger value="editor" className="gap-2">
              <Pencil size={16} /> Editor
            </TabsTrigger>
            <TabsTrigger value="preview" className="gap-2">
              <Eye size={16} /> Preview
            </TabsTrigger>
          </TabsList>
          <div className="flex flex-row gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant={
                    selectedScreenSize === "desktop" ? "secondary" : "ghost"
                  }
                  onClick={() => handleScreenSizeChange("desktop")}
                >
                  <Monitor size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">Desktop view</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant={
                    selectedScreenSize === "mobile" ? "secondary" : "ghost"
                  }
                  onClick={() => handleScreenSizeChange("mobile")}
                >
                  <Smartphone size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">Mobile view</TooltipContent>
            </Tooltip>
          </div>
          <div className="flex flex-row gap-2 items-center">
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
            <SidebarTrigger
              position="right"
              iconSize={16}
              // className={buttonVariants({ size: "icon", variant: "ghost" })}
            />
          </div>
        </div>

        <div className="flex justify-center w-full">
          <div
            className={cn(selectedScreenSize === "mobile" ? "w-96" : "w-full")}
          >
            <TabsContent value="editor">
              <EditorBlock id="root" />
            </TabsContent>
            <TabsContent value="preview">
              <Reader
                document={document}
                args={args || {}}
                rootBlockId="root"
              />
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </>
  );
}
