import { Button, PopoverTrigger } from "@vivid/ui";
import { Plus } from "lucide-react";
type Props = {};
export default function PlaceholderButton() {
  return (
    <div className="flex content-center justify-center w-full">
      <PopoverTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          className="text-secondary-foreground"
        >
          <Plus size={16} />
        </Button>
      </PopoverTrigger>
    </div>
  );
}
