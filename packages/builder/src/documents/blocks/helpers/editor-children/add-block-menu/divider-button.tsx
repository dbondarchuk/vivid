import { Button, cn, PopoverTrigger } from "@vivid/ui";
import { Plus } from "lucide-react";
import React from "react";

export const DividerButton: React.FC<{ size?: "small" | "default" }> = ({
  size = "default",
}) => {
  // const [visible, setVisible] = React.useState(false);
  // const buttonElement = React.createRef<HTMLButtonElement>();

  // React.useEffect(() => {
  //   function listener({ clientX, clientY }: MouseEvent) {
  //     if (!buttonElement?.current) {
  //       return;
  //     }
  //     const rect = buttonElement.current.getBoundingClientRect();
  //     const rectY = rect.y;
  //     const bottomX = rect.x;
  //     const topX = bottomX + rect.width;

  //     if (Math.abs(clientY - rectY) < 20) {
  //       if (bottomX < clientX && clientX < topX) {
  //         setVisible(true);
  //         return;
  //       }
  //     }
  //     setVisible(false);
  //   }
  //   window.addEventListener("mousemove", listener);
  //   return () => {
  //     window.removeEventListener("mousemove", listener);
  //   };
  // }, [buttonElement, setVisible]);

  return (
    <div className="relative peer-button [&:has(+_.peer-block.outline)>button]:opacity-100 [&:hover>button]:opacity-100">
      <PopoverTrigger asChild>
        <Button
          // ref={buttonElement}
          variant="outline"
          size="icon"
          className={cn(
            "animate-in absolute -top-3 left-1/2 -translate-x-2 z-30 hover:z-[60] text-secondary-foreground opacity-0 transition-all hover:opacity-100",
            size === "small" && "w-4 h-4",
          )}
        >
          <Plus fontSize="small" size={16} />
        </Button>
      </PopoverTrigger>
    </div>
  );
};
