"use client";

import { ControllerRenderProps } from "react-hook-form";
import { InputGroupInputClasses, InputGroupSuffixClasses } from "./inputGroup";
import { Button } from "./button";
import { Input } from "./input";
import { InputGroup, InputGroupInput } from "./inputGroup";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./dialog";
import React from "react";
import { Asset } from "@vivid/types";
import { toast } from "./use-toast";
import { Spinner } from "./spinner";
import Image from "next/image";
import { cn } from "../utils";
import { ScrollArea } from "./scroll-area";
import { File } from "lucide-react";

export type InputAssetSelectorProps = {
  field: ControllerRenderProps<any>;
  type?: string;
  disabled?: boolean;
  placeholder?: string;
};

export const InputAssetSelector: React.FC<InputAssetSelectorProps> = ({
  field,
  type,
  placeholder,
  disabled,
}) => {
  const [selected, setSelected] = React.useState<Asset | undefined>(undefined);
  const [search, setSearch] = React.useState("");

  const [open, setIsOpen] = React.useState(false);
  const [loading, setIsLoading] = React.useState(false);
  const [assets, setAssets] = React.useState<Asset[]>([]);
  const loadAssets = async () => {
    if (assets?.length) return;

    setIsLoading(true);
    try {
      let url = "/admin/api/assets";
      if (type) url += `?mimeType=${encodeURIComponent(type)}`;

      const res = await fetch(url);
      const assets = (await res.json()) as Asset[];

      setAssets(assets || []);
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
    }

    setIsLoading(false);
  };

  const select = (asset: Asset) => {
    setSelected(selected?._id === asset._id ? undefined : asset);
  };

  const selectAndClose = () => {
    if (!selected) return;

    field.onChange(`/assets/${selected.filename}`);
    setIsOpen(false);
  };

  const openDialog = () => {
    loadAssets();
    setIsOpen(true);
  };

  return (
    <InputGroup>
      <Dialog open={open} onOpenChange={(open) => setIsOpen(open)}>
        <DialogContent className="sm:max-w-[80%]">
          <DialogHeader>
            <DialogTitle>Select asset</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="w-full">
              <Input
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            {loading && (
              <div className="w-full h-full flex items-center justify-center">
                <Spinner className="w-10 h-10" />
              </div>
            )}
            <ScrollArea className="h-[60vh] w-full">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {assets
                  ?.filter(
                    (asset) =>
                      !search ||
                      asset.filename
                        .toLocaleLowerCase()
                        .indexOf(search.toLocaleLowerCase()) >= 0 ||
                      (asset.description || "")
                        .toLocaleLowerCase()
                        .indexOf(search.toLocaleLowerCase()) >= 0
                  )
                  .map((asset) => (
                    <div
                      tabIndex={0}
                      onClick={() => setSelected(asset)}
                      onKeyDown={(e) =>
                        (e.key === "Enter" || e.key === " ") && select(asset)
                      }
                      className={cn(
                        "border rounded-md flex flex-col gap-3 items-center justify-center cursor-pointer py-3",
                        selected?._id === asset._id ? "bg-blue-50" : ""
                      )}
                      key={asset._id}
                    >
                      {asset.mimeType.startsWith("image") ? (
                        <Image
                          alt={asset.description || ""}
                          src={`/assets/${asset.filename}`}
                          width={60}
                          height={60}
                        />
                      ) : (
                        <div className="rounded-sm border-dashed border  p-2 flex flex-col gap-1 items-center">
                          <File size={20} />
                          <span className="text-muted-foreground">
                            {asset.mimeType}
                          </span>
                        </div>
                      )}
                      <div className="flex flex-col gap-1 items-center">
                        <span>{asset.filename}</span>
                        {asset.description && (
                          <span className="text-muted-foreground">
                            {asset.description}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </ScrollArea>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsOpen(false)}
            >
              Close
            </Button>
            <Button type="button" disabled={!selected} onClick={selectAndClose}>
              Select
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <InputGroupInput>
        <Input
          disabled={disabled}
          placeholder={placeholder}
          className={InputGroupInputClasses()}
          {...field}
        />
      </InputGroupInput>
      <Button
        type="button"
        variant="outline"
        disabled={disabled}
        className={InputGroupSuffixClasses()}
        onClick={openDialog}
      >
        Select
      </Button>
    </InputGroup>
  );
};
