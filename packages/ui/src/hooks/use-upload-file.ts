import { UploadedFile } from "@vivid/types";
import * as React from "react";

import { toast } from "sonner";
import { z } from "zod";

export type UseUploadFileProps = {
  onUploadComplete?: (file: UploadedFile) => void;
  onUploadError?: (error: unknown) => void;
  description?: string;
} & ({ bucket?: string } | { appointmentId: string } | { customerId: string });

const uploadFilesWithProgress = ({
  file,
  description,
  bucket,
  appointmentId,
  customerId,
  onProgress,
}: {
  file: File;
  description?: string;
  bucket?: string;
  appointmentId?: string;
  customerId?: string;
  onProgress: (progress: number) => void;
}): Promise<{
  status: number;
  body: string;
}> => {
  const url = `/admin/api/assets`;

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.upload.addEventListener("progress", (e) =>
      onProgress(Math.round((e.loaded / e.total) * 100))
    );
    xhr.addEventListener("load", () =>
      resolve({ status: xhr.status, body: xhr.responseText })
    );
    xhr.addEventListener("error", () =>
      reject(new Error("File upload failed"))
    );
    xhr.addEventListener("abort", () =>
      reject(new Error("File upload aborted"))
    );

    xhr.open("POST", url, true);

    const formData = new FormData();
    formData.append("file", file);
    if (bucket) formData.append("bucket", bucket);
    if (description) formData.append("description", description);
    if (appointmentId) formData.append("appointmentId", appointmentId);
    if (customerId) formData.append("customerId", customerId);

    xhr.send(formData);
  });
};

export function useUploadFile({
  onUploadComplete,
  onUploadError,
  ...rest
}: UseUploadFileProps = {}) {
  const [uploadedFile, setUploadedFile] = React.useState<UploadedFile>();
  const [uploadingFile, setUploadingFile] = React.useState<File>();
  const [progress, setProgress] = React.useState<number>(0);
  const [isUploading, setIsUploading] = React.useState(false);

  async function uploadFile(file: File) {
    setIsUploading(true);
    setUploadingFile(file);

    try {
      const response = await uploadFilesWithProgress({
        file,
        onProgress: setProgress,
        ...rest,
      });

      if (response.status >= 400) {
        throw new Error(`${response.status}: ${response.body}`);
      }

      const result = JSON.parse(response.body) as UploadedFile;

      setUploadedFile(result);

      onUploadComplete?.(result);

      return uploadedFile;
    } catch (error) {
      const errorMessage = getErrorMessage(error);

      const message =
        errorMessage.length > 0
          ? errorMessage
          : "Something went wrong, please try again later.";

      toast.error(message);

      onUploadError?.(error);
    } finally {
      setProgress(0);
      setIsUploading(false);
      setUploadingFile(undefined);
    }
  }

  return {
    isUploading,
    progress,
    uploadedFile,
    uploadFile: uploadFile,
    uploadingFile,
  };
}

export function getErrorMessage(err: unknown) {
  const unknownError = "Something went wrong, please try again later.";

  if (err instanceof z.ZodError) {
    const errors = err.issues.map((issue) => {
      return issue.message;
    });

    return errors.join("\n");
  } else if (err instanceof Error) {
    return err.message;
  } else {
    return unknownError;
  }
}

export function showErrorToast(err: unknown) {
  const errorMessage = getErrorMessage(err);

  return toast.error(errorMessage);
}
