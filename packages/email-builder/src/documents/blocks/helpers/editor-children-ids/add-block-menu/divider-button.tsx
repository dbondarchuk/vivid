import { Button, PopoverTrigger } from "@vivid/ui";
import { Plus } from "lucide-react";
import React, { useEffect, useState } from "react";

type Props = {};

export default function DividerButton() {
  const [visible, setVisible] = useState(false);
  const buttonElement = React.createRef<HTMLButtonElement>();

  useEffect(() => {
    function listener({ clientX, clientY }: MouseEvent) {
      if (!buttonElement?.current) {
        return;
      }
      const rect = buttonElement.current.getBoundingClientRect();
      const rectY = rect.y;
      const bottomX = rect.x;
      const topX = bottomX + rect.width;

      if (Math.abs(clientY - rectY) < 20) {
        if (bottomX < clientX && clientX < topX) {
          setVisible(true);
          return;
        }
      }
      setVisible(false);
    }
    window.addEventListener("mousemove", listener);
    return () => {
      window.removeEventListener("mousemove", listener);
    };
  }, [buttonElement, setVisible]);

  return (
    <div className="animate-in relative">
      <PopoverTrigger asChild>
        <Button
          ref={buttonElement}
          variant="outline"
          size="icon"
          className="absolute -top-3 left-1/2 -translate-x-2 z-30 hover:z-[60] text-secondary-foreground"
        >
          <Plus fontSize="small" size={16} />
        </Button>
      </PopoverTrigger>
    </div>
  );
}
