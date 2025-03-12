import { Button } from "@vivid/ui";
import { X } from "lucide-react";

export const ResetButton: React.FC<{
  onClick: (value: null) => void;
}> = ({ onClick }) => {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => {
        onClick(null);
        onClick(null);
      }}
    >
      <X size={16} />
    </Button>
  );
};
