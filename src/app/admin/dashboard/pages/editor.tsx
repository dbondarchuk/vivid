"use client";
import { Button as PuckButton, Puck, ActionBar } from "@measured/puck";
import headingAnalyzer from "@measured/puck-plugin-heading-analyzer";
import config, { initialData } from "@/components/pages/config";
import { Link } from "@/components/ui/link";

import "@measured/puck/puck.css";
import React from "react";
import { Maximize2, Minimize2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
const key = "page";

export const Editor: React.FC<{
  path: string;
  header: React.ReactNode;
  footer: React.ReactNode;
}> = ({ path, header, footer }) => {
  const [fullscreen, setFullscreen] = React.useState(false);

  const conf = config(header, footer);

  return (
    <div
      className={cn(
        "w-full",
        !fullscreen ? "[&_div:nth-child(1)]:!relative" : "z-[60]"
      )}
      style={{
        "--overlay-background": "transparent !important",
      }}
    >
      <Puck
        config={conf}
        viewports={undefined}
        data={initialData}
        onPublish={async (data) => {
          localStorage.setItem(key, JSON.stringify(data));
        }}
        plugins={[headingAnalyzer]}
        headerPath={path}
        iframe={{
          enabled: false,
        }}
        overrides={{
          headerActions: ({ children }) => (
            <>
              <div className="flex flex-row gap-2">
                <Button
                  variant="ghost"
                  title={fullscreen ? "Enter fullscreen" : "Exit fullscreen"}
                  size="icon"
                  onClick={() => setFullscreen(!fullscreen)}
                >
                  {fullscreen ? (
                    <Minimize2 size={20} />
                  ) : (
                    <Maximize2 size={20} />
                  )}
                </Button>
                <PuckButton href={path} newTab variant="secondary">
                  View page
                </PuckButton>
              </div>

              {children}
            </>
          ),
        }}
      />
    </div>
  );
};
