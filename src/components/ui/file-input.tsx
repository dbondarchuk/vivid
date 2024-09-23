import React, { InputHTMLAttributes } from "react";
import { Accept, useDropzone } from "react-dropzone";
import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./form";

export type FileInputProps = InputHTMLAttributes<HTMLInputElement> & {
  name: string;
  label?: string;
  accept?: Accept;
};

export const FileInput: React.FC<FileInputProps> = ({
  name,
  label = name,
  accept,
  ...rest
}) => {
  const { setValue, watch, control } = useFormContext();
  const files: File[] = watch(name);
  const onDrop = React.useCallback(
    (droppedFiles: File[]) => {
      setValue(name, droppedFiles, { shouldValidate: true });
    },
    [setValue, name]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    maxFiles: 1,
    onDrop,
    accept: accept,
  });

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel htmlFor={name}>{label}</FormLabel>
          <FormControl>
            <div {...getRootProps()} className="mb-8">
              <input
                type="file"
                {...rest}
                className="focus:shadow-outline w-full appearance-none rounded border
py-2 px-3 leading-tight text-background shadow focus:outline-none"
                id={name}
                {...getInputProps()}
              />
              <div
                className={
                  "w-full border border-dashed border-gray-90@ p-2 text-black " +
                  (isDragActive ? "bg-slate-400" : "bg-slate-200")
                }
              >
                {isDragActive ? (
                  <p className="my-2 text-center">Drop the files here ...</p>
                ) : (
                  <p className="my-2 text-center">
                    Drag &apos;n&apos; drop some files here, or click to select
                    files
                  </p>
                )}
                {!!files?.length && (
                  <div className="mt-2 grid grid-cols-1 gap-1">
                    {files.map((file) => {
                      return (
                        <div key={file.name}>
                          {file.type?.startsWith("image") ? (
                            <img
                              src={URL.createObjectURL(file)}
                              alt={file.name}
                              className="w-full object-contain max-h-[30vh]"
                            />
                          ) : (
                            <span>{file.name}</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
