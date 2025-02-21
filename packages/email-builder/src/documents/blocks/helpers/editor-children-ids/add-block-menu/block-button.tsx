import { Button, Text } from "@vivid/ui";
import React from "react";

type BlockMenuButtonProps = {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
};

export default function BlockTypeButton({
  label,
  icon,
  onClick,
}: BlockMenuButtonProps) {
  return (
    <Button
      className="flex flex-row gap-2 h-auto"
      variant="ghost"
      onClick={(ev) => {
        onClick();
      }}
    >
      <div className="[&_svg]:size-4">{icon}</div>
      <Text className="font-secondary">{label}</Text>
    </Button>
  );
}
