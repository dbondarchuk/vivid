"use client";

import { mimeTypeToExtension } from "@vivid/utils";
import React, { InputHTMLAttributes } from "react";
import { Accept, useDropzone } from "react-dropzone";
import { DefaultExtensionType, defaultStyles, FileIcon } from "react-file-icon";

export type DndFileInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "value" | "onChange" | "accept"
> & {
  value?: File;
  onChange?: (value: File) => void;
  accept?: Accept;
};

export const DndFileInput: React.FC<DndFileInputProps> = ({
  accept,
  value,
  onChange,
  ...rest
}) => {
  const onDrop = React.useCallback(
    (droppedFiles: File[]) => {
      onChange?.(droppedFiles[0]);
    },
    [onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    maxFiles: 1,
    onDrop,
    accept: accept,
  });

  return (
    <div {...getRootProps()}>
      <input
        type="file"
        {...rest}
        className="focus:shadow-outline w-full appearance-none rounded border
py-2 px-3 leading-tight text-background shadow focus:outline-none"
        {...getInputProps()}
      />
      <div
        className={
          "w-full border border-dashed border-primary rounded-md p-2 text-black " +
          (isDragActive && "bg-primary/20")
        }
      >
        {isDragActive ? (
          <p className="my-2 text-center">Drop the files here ...</p>
        ) : (
          <p className="my-2 text-center">
            Drag &apos;n&apos; drop some files here, or click to select files
          </p>
        )}
        {!!value && (
          <div className="mt-2 grid grid-cols-1 gap-1">
            <div key={value.name}>
              {value.type?.startsWith("image") ? (
                <img
                  src={URL.createObjectURL(value)}
                  alt={value.name}
                  className="w-full object-contain max-h-[30vh]"
                />
              ) : (
                <div className="flex flex-col gap-2 text-sm justify-center">
                  <div className="max-w-10 flex self-center">
                    <FileIcon
                      extension={value.name.substring(
                        value.name.lastIndexOf(".") + 1
                      )}
                      {...defaultStyles[
                        mimeTypeToExtension(value.type) as DefaultExtensionType
                      ]}
                    />
                  </div>
                  <div className="text-muted-foreground text-center">
                    {value.name.substring(value.name.lastIndexOf("/") + 1)}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
