import { useDraggable } from "@dnd-kit/react";
import { BuilderKeys, useI18n } from "@vivid/i18n";
import {
  Button,
  cn,
  genericMemo,
  Input,
  ScrollArea,
  useDebounce,
} from "@vivid/ui";
import { GripVertical, Search, X } from "lucide-react";
import { memo, useMemo, useState } from "react";
import { useBlocks, useRootBlockType } from "../../../documents/editor/context";
import { BaseZodDictionary } from "../../../documents/types";

type BlocksPanelProps<T extends BaseZodDictionary = any> = {
  allowOnly?: (keyof T)[];
};
type DraggableBlockItemProps = {
  blockType: string;
  blockConfig: any;
};

const DraggableBlockItem: React.FC<DraggableBlockItemProps> = memo(
  ({ blockType, blockConfig }) => {
    const { isDragging, ref } = useDraggable({
      id: `template-${blockType}`,
      type: blockType,
      feedback: "move",

      data: {
        type: "block-template",
        blockType,
        blockConfig,
      },
    });

    const t = useI18n("builder");

    return (
      <>
        <div
          ref={ref}
          className={cn(
            "flex items-center gap-2 p-3 rounded-lg border border-border bg-background hover:bg-accent hover:text-accent-foreground cursor-grab active:cursor-grabbing transition-colors",
            isDragging ? "opacity-50" : "!opacity-100",
          )}
        >
          <div className="flex-shrink-0 text-muted-foreground">
            {blockConfig.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate">
              {t(blockConfig.displayName as BuilderKeys)}
            </div>
            <div className="text-xs text-muted-foreground truncate">
              {t(blockConfig.category as BuilderKeys)}
            </div>
          </div>
          <div className="flex-shrink-0 text-muted-foreground">
            <GripVertical fontSize="small" />
          </div>
        </div>
      </>
    );
  },
);

const BlocksPanelContent = memo(
  ({
    filteredBlocks,
  }: {
    filteredBlocks: Record<string, Array<{ type: string; config: any }>>;
  }) => {
    const t = useI18n("builder");

    return (
      <ScrollArea className="py-2 pr-2 h-[calc(100vh-400px)] min-h-60">
        {Object.keys(filteredBlocks).length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Search className="h-12 w-12 text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">
              {t("baseBuilder.blocks.noResultsFound")}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(filteredBlocks).map(([category, blockList]) => (
              <div key={category} className="space-y-3">
                <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  {t(category as BuilderKeys)}
                </h4>
                <div className="grid grid-cols-1 gap-2">
                  {blockList.map(({ type, config }) => (
                    <DraggableBlockItem
                      key={type}
                      blockType={type}
                      blockConfig={config}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    );
  },
);

export const BlocksPanel = genericMemo(
  <T extends BaseZodDictionary = any>({ allowOnly }: BlocksPanelProps<T>) => {
    const t = useI18n("builder");
    const [searchQuery, setSearchQuery] = useState("");
    const debouncedSearchQuery = useDebounce(searchQuery, 300);
    const blocks = useBlocks();
    const rootBlockType = useRootBlockType();

    const filteredBlocks = useMemo(() => {
      return Object.entries(blocks)
        .filter(([type, config]) => {
          // Filter by allowOnly if specified
          if (allowOnly) {
            if (Array.isArray(allowOnly)) {
              if (!allowOnly.includes(type as keyof T)) return false;
            } else {
              if (type !== allowOnly) return false;
            }
          }

          // Don't show root block type
          if (rootBlockType === type) return false;
          if (debouncedSearchQuery.trim()) {
            const query = debouncedSearchQuery.trim();
            const name = config.displayName.toLocaleLowerCase();
            const displayName = t(
              config.displayName as BuilderKeys,
            ).toLocaleLowerCase();
            const category = t(
              config.category as BuilderKeys,
            ).toLocaleLowerCase();
            const typeLower = type.toLocaleLowerCase();

            if (
              !name.includes(query) &&
              !displayName.includes(query) &&
              !category.includes(query) &&
              !typeLower.includes(query)
            ) {
              return false;
            }
          }

          return true;
        })
        .reduce(
          (acc, [type, config]) => {
            const category = config.category;
            if (!acc[category]) {
              acc[category] = [];
            }
            acc[category].push({ type, config });
            return acc;
          },
          {} as Record<string, Array<{ type: string; config: any }>>,
        );
    }, [blocks, allowOnly, rootBlockType, t, debouncedSearchQuery]);

    return (
      <>
        <p className="text-xs text-muted-foreground mb-3">
          {t("baseBuilder.blocks.panel.subtitle")}
        </p>
        <div className="relative mb-2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("baseBuilder.blocks.search")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-10"
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 transform -translate-y-1/2"
            onClick={() => setSearchQuery("")}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <BlocksPanelContent filteredBlocks={filteredBlocks} />
      </>
    );
  },
);
