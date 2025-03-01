"use client";

import { UploadedFile } from "@vivid/types";
import React from "react";
import { Accept } from "react-dropzone";
import { DndFileInput, ScrollArea, toast } from ".";
import { useUploadFile } from "../hooks";
import { cn } from "../utils";
import { AssetPreview } from "./asset-preview";
import { Button } from "./button";
import { Input } from "./input";
import { Modal } from "./modal";
import { Progress } from "./progress";
import { Spinner } from "./spinner";

export type AssetSelectorProps = {
  accept?: string[];
  onSelected: (asset: UploadedFile) => void;
  isOpen: boolean;
  close: () => void;
};

export const AssetSelectorDialog: React.FC<AssetSelectorProps> = ({
  accept,
  onSelected,
  close,
  isOpen,
}) => {
  const [selected, setSelected] = React.useState<UploadedFile | undefined>(
    undefined
  );
  const [search, setSearch] = React.useState("");

  const [loading, setIsLoading] = React.useState(false);
  const [assets, setAssets] = React.useState<UploadedFile[]>([]);
  const loadAssets = async () => {
    if (assets?.length) return;

    setIsLoading(true);
    try {
      let url = "/admin/api/assets";
      if (accept?.length) {
        const acceptQuery = accept.map(
          (type) => `accept=${encodeURIComponent(type)}`
        );
        url += `?${acceptQuery.join("&")}`;
      }

      const res = await fetch(url);
      const assets = (await res.json()) as UploadedFile[];

      setAssets(assets || []);
    } catch (e) {
      toast.error("There was a problem with your request.");
    }

    setIsLoading(false);
  };

  const select = (asset: UploadedFile) => {
    setSelected(selected?._id === asset._id ? undefined : asset);
  };

  const selectAndClose = () => {
    if (!selected) return;

    onSelected(selected);
    close();
  };

  const toLoad = 24; // divisible by 1, 2, 3

  const [loaded, setLoaded] = React.useState(toLoad);

  React.useEffect(() => {
    if (isOpen) {
      loadAssets();
      setLoaded(toLoad);
    }

    setSelected(undefined);
  }, [isOpen]);

  const scrollTarget = React.useRef<HTMLDivElement>(null);

  const [listId, setListId] = React.useState<string | undefined>(undefined);

  React.useEffect(() => {
    if (scrollTarget.current) {
      setTimeout(() => {
        setListId(scrollTarget.current?.id);
      }, 0);
    }
  }, [scrollTarget.current]);

  const [fileToUpload, setFileToUpload] = React.useState<File | undefined>();
  const { isUploading, progress, uploadFile } = useUploadFile({
    onUploadComplete: (file) => {
      setAssets((old) => [file, ...old]);
      setSelected(file);
    },
  });

  const onSubmit = async () => {
    if (!fileToUpload) return;

    await uploadFile(fileToUpload);
    setFileToUpload(undefined);
  };

  const disabled = loading || isUploading;
  const onClose = () => {
    if (!isUploading) close();
  };

  return (
    <Modal
      title="Select asset"
      isOpen={isOpen}
      onClose={onClose}
      className="sm:max-w-[80%]"
    >
      <ScrollArea className="w-full h-[80vh]">
        <div className="flex flex-col gap-4">
          <div className="w-full">
            <Input
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="w-full flex flex-col gap-2 relative">
            <DndFileInput
              value={fileToUpload}
              onChange={setFileToUpload}
              disabled={disabled}
              accept={accept?.reduce(
                (map, cur) => ({
                  ...map,
                  [cur]: [],
                }),
                {} as Accept
              )}
            />
            <Button
              variant="default"
              className="w-full"
              disabled={disabled || !fileToUpload}
              onClick={onSubmit}
            >
              Upload
            </Button>
            {isUploading && (
              <>
                <div className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-white opacity-50">
                  <div role="status">
                    <Spinner className="w-10 h-10" />
                    <span className="sr-only">Please wait...</span>
                  </div>
                </div>
                <Progress value={progress} />
              </>
            )}
          </div>
          {loading && (
            <div className="w-full h-full flex items-center justify-center">
              <Spinner className="w-10 h-10" />
            </div>
          )}
          <div
            className="h-[60vh] w-full"
            id="asset-scroll-area"
            ref={scrollTarget}
          >
            {/* <InfiniteScroll
              dataLength={values.length}
              next={fetchMore}
              hasMore={hasMore}
              loader={<h4>Loading...</h4>}
              scrollableTarget={listId}
            > */}
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
                      "border rounded-md flex flex-col gap-3 items-center justify-between cursor-pointer py-3",
                      selected?._id === asset._id ? "bg-blue-50" : ""
                    )}
                    key={asset._id}
                  >
                    <AssetPreview asset={asset} />
                    <div className="flex flex-col gap-1 items-center text-center">
                      <span className="text-muted-foreground">
                        {asset.description}
                      </span>
                      <span>
                        {asset.filename?.substring(
                          asset.filename?.lastIndexOf("/") + 1
                        )}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
            {/* </InfiniteScroll> */}
          </div>
        </div>
      </ScrollArea>
      <div className="flex w-full items-center justify-end space-x-2 pt-6">
        <Button
          type="button"
          variant="secondary"
          disabled={isUploading}
          onClick={close}
        >
          Close
        </Button>
        <Button
          type="button"
          disabled={!selected || isUploading}
          onClick={selectAndClose}
        >
          Select
        </Button>
      </div>
    </Modal>
  );
};
