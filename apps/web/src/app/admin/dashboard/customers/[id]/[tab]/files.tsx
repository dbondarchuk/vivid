"use client";

import { Asset, WithTotal } from "@vivid/types";
import { useInView } from "react-intersection-observer";

import {
  AssetPreview,
  Button,
  Checkbox,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DndFileInput,
  Progress,
  Skeleton,
  Spinner,
  Textarea,
  cn,
  toast,
  useSelectedRowsStore,
  useUploadFile,
} from "@vivid/ui";
import React from "react";
import { useRouter } from "next/navigation";
import { Upload } from "lucide-react";

const AssetItem: React.FC<{ asset: Asset }> = ({ asset }) => {
  const { rowSelection, setRowSelection } = useSelectedRowsStore();
  const setSelected = React.useCallback(() => {
    const index = rowSelection.findIndex((row: Asset) => row._id === asset._id);
    const newRows = [...rowSelection];
    if (index >= 0) {
      newRows.splice(index, 1);
    } else {
      newRows.push(asset);
    }

    setRowSelection(newRows);
  }, [rowSelection, setRowSelection]);

  const isSelected = !!rowSelection.find((row: Asset) => row._id === asset._id);
  return (
    <div
      tabIndex={0}
      role="button"
      onClick={setSelected}
      className={cn(
        "border rounded-md flex flex-col gap-3 items-center justify-between cursor-pointer py-3 relative",
        isSelected ? "bg-accent" : ""
      )}
      key={asset._id}
    >
      <Checkbox
        id={`asset-${asset._id}`}
        checked={isSelected}
        className="absolute top-1 left-1"
      />
      <AssetPreview asset={asset} />
      <div className="flex flex-col gap-1 items-center text-center">
        <span className="text-muted-foreground">{asset.description}</span>
        <span>
          {asset.filename?.substring(asset.filename?.lastIndexOf("/") + 1)}
        </span>
      </div>
    </div>
  );
};

const Loader: React.FC<{ className?: string }> = ({ className }) => (
  <div
    className={cn(
      "border rounded-md flex flex-col gap-3 items-center justify-between cursor-pointer py-3",
      className
    )}
  >
    <Skeleton className="w-16 h-16" />
    <div className="flex flex-col gap-1 items-center text-center">
      <Skeleton className="max-w-72 min-w-52 w-full h-6" />
      <Skeleton className="max-w-72 min-w-52 w-full h-5" />
    </div>
  </div>
);

const Loaders = () => (
  <>
    <Loader />
    <Loader />
    <Loader className="max-lg:hidden" />
    <Loader className="max-xl:hidden" />
  </>
);

export const CustomerFileUpload: React.FC<{
  customerId: string;
}> = ({ customerId }) => {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const onUpload = () => {
    setDescription(undefined);
    setDisabled(false);
    setOpen(false);
    router.replace(`?key=${new Date().getTime()}`);
  };

  const [description, setDescription] = React.useState<string>();
  const [fileToUpload, setFileToUpload] = React.useState<File | undefined>();
  const [disabled, setDisabled] = React.useState(false);
  const { isUploading, progress, uploadFile } = useUploadFile({
    onUploadComplete: (file) => {
      onUpload();
    },
    onUploadError: () => {
      setDisabled(false);
    },
    customerId,
    description,
  });

  const onSubmit = async () => {
    if (!fileToUpload) return;

    await uploadFile(fileToUpload);
    setFileToUpload(undefined);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">
          <Upload /> Add new
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload new file</DialogTitle>
          <DialogDescription>Add new file to the customer</DialogDescription>
        </DialogHeader>

        <div className="w-full flex flex-col gap-2 relative">
          <DndFileInput
            value={fileToUpload}
            onChange={setFileToUpload}
            disabled={disabled}
          />
          <Textarea
            className="w-full"
            autoResize
            placeholder="Description"
            value={description ?? ""}
            onChange={(e) => setDescription(e.currentTarget.value)}
          />
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
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary" disabled={disabled}>
              Close
            </Button>
          </DialogClose>
          <Button
            variant="default"
            disabled={disabled || !fileToUpload}
            onClick={onSubmit}
          >
            Upload
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const toLoad = 24; // divisible by 1, 2, 3

export const CustomerFiles: React.FC<{
  customerId: string;
  search: string | null;
}> = ({ customerId, search }) => {
  const [assets, setAssets] = React.useState<Asset[]>([]);
  const [page, setPage] = React.useState(1);
  const [loading, setLoading] = React.useState(false);
  const [hasMore, setHasMore] = React.useState(true);
  const [initialLoad, setInitialLoad] = React.useState(true);
  const { ref, inView } = useInView({
    threshold: 0.5,
  });

  const loadAssets = React.useCallback(
    async (page: number) => {
      let url = `/admin/api/assets?customer=${customerId}&page=${page}&limit=${toLoad}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;

      const response = await fetch(url, {
        method: "GET",
        cache: "default",
      });

      const res = (await response.json()) as WithTotal<Asset>;

      return {
        items: res.items,
        hasMore: page * toLoad < res.total,
      };
    },
    [customerId, search]
  );

  React.useEffect(() => {
    setPage(1);
    setHasMore(true);
    setInitialLoad(false);
    setAssets([]);
  }, [customerId, search]);

  React.useEffect(() => {
    const loadItems = async () => {
      if (!hasMore && !initialLoad) return;

      setLoading(true);
      try {
        const result = await loadAssets(page);

        if (page === 1) {
          setAssets(result.items);
        } else {
          setAssets((prev) => [...prev, ...result.items]);
        }

        setHasMore(result.hasMore);
        setInitialLoad(false);
      } catch (error) {
        console.error("Failed to fetch items:", error);
        toast.error("There was a problem with your request.");
      } finally {
        setLoading(false);
      }
    };

    loadItems();
  }, [page, loadAssets, initialLoad, hasMore]);

  React.useEffect(() => {
    if (inView && !loading && hasMore) {
      setPage((prev) => prev + 1);
    }
  }, [inView, loading, hasMore]);

  return (
    // <div className="flex flex-col gap-2 w-full">
    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full">
      {loading && page === 1 && <Loaders />}
      {assets?.map((asset) => <AssetItem asset={asset} key={asset._id} />)}
      {hasMore && !loading && <div ref={ref} className="h-1" />}
      {loading && page > 1 && <Loaders />}
    </div>
    // </div>
  );
};
