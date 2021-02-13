import React from "react";
import { useReducer } from "react";
import { useDropzone } from "react-dropzone";
import axios, { AxiosError, AxiosResponse, CancelTokenSource } from "axios";
import { ActionType, createAction, getType } from "typesafe-actions";

import {
  EmptyState,
  EmptyStateBody,
  Button,
  EmptyStateVariant,
  Stack,
  StackItem,
  Split,
  SplitItem,
  Progress,
  ProgressVariant,
  ProgressSize,
  ButtonVariant,
} from "@patternfly/react-core";
import { TimesIcon, TrashIcon } from "@patternfly/react-icons";

import styles from "./upload-files-dropzone.module.scss";

const CANCEL_MESSAGE = "cancelled";

// Actions

const queueUpload = createAction("dropzone/upload/queue")<{
  file: File;
  cancelFn: CancelTokenSource;
}>();
const uploadProgress = createAction("dropzone/upload/progress")<{
  file: File;
  progress: number;
}>();
const cancelUpload = createAction("dropzone/upload/cancel")<{
  file: File;
}>();
const uploadSuccess = createAction("dropzone/upload/success")<{
  file: File;
  response: AxiosResponse;
}>();
const uploadError = createAction("dropzone/upload/error")<{
  file: File;
  error: AxiosError;
}>();
const removeUpload = createAction("dropzone/upload/remove")<{
  file: File;
}>();

//

interface PromiseConfig {
  formData: FormData;
  config: any;

  thenFn: (response: AxiosResponse) => void;
  catchFn: (error: AxiosError) => void;
}

interface Upload {
  progress: number;
  status: "queued" | "inProgress" | "cancelled" | "success" | "error";
  cancelFn: CancelTokenSource;
  error?: AxiosError;
}

interface Status {
  uploads: Map<File, Upload>;
  uploadsResponse: Map<File, AxiosResponse>;
}

//

type Action = ActionType<
  | typeof queueUpload
  | typeof uploadProgress
  | typeof cancelUpload
  | typeof uploadSuccess
  | typeof uploadError
  | typeof removeUpload
>;

const reducer = (state: Status, action: Action): Status => {
  switch (action.type) {
    case getType(queueUpload):
      return {
        ...state,
        uploads: new Map(state.uploads).set(action.payload.file, {
          progress: 0,
          status: "queued",
          cancelFn: action.payload.cancelFn,
        }),
      };
    case getType(uploadProgress):
      return {
        ...state,
        uploads: new Map(state.uploads).set(action.payload.file, {
          ...state.uploads.get(action.payload.file)!,
          status: "inProgress",
          progress: action.payload.progress,
        }),
      };
    case getType(cancelUpload):
      return {
        ...state,
        uploads: new Map(state.uploads).set(action.payload.file, {
          ...state.uploads.get(action.payload.file)!,
          status: "cancelled",
        }),
      };
    case getType(uploadSuccess):
      return {
        ...state,
        uploads: new Map(state.uploads).set(action.payload.file, {
          ...state.uploads.get(action.payload.file)!,
          status: "success",
        }),
        uploadsResponse: new Map(state.uploadsResponse).set(
          action.payload.file,
          action.payload.response
        ),
      };
    case getType(uploadError):
      return {
        ...state,
        uploads: new Map(state.uploads).set(action.payload.file, {
          ...state.uploads.get(action.payload.file)!,
          status: "error",
          error: action.payload.error,
        }),
      };
    case getType(removeUpload):
      const newUploads = new Map(state.uploads);
      newUploads.delete(action.payload.file);

      const newUploadsResponse = new Map(state.uploadsResponse);
      newUploadsResponse.delete(action.payload.file);

      return {
        ...state,
        uploads: newUploads,
        uploadsResponse: newUploadsResponse,
      };
    default:
      throw new Error("Reducer can not process type");
  }
};

export interface UploadFilesDropzoneProps {
  url: string;
  accept?: string | string[];
  serial?: boolean;
  onUpload?: (response: AxiosResponse, file: File) => void;
  onError?: (error: AxiosError, file: File) => void;
  onDelete?: (response: AxiosResponse, file: File) => void;
}

export const UploadFilesDropzone: React.FC<UploadFilesDropzoneProps> = ({
  url,
  accept,
  serial,
  onUpload,
  onError,
  onDelete,
}) => {
  const [state, dispatch] = useReducer(reducer, {
    uploads: new Map(),
    uploadsResponse: new Map(),
  } as Status);

  const handleUpload = (acceptedFiles: File[]) => {
    const promisesQueue: PromiseConfig[] = [];

    for (let index = 0; index < acceptedFiles.length; index++) {
      const file = acceptedFiles[index];

      // Upload
      const formData = new FormData();
      formData.set("file", file);

      const cancelFn = axios.CancelToken.source();

      const config = {
        headers: {
          "X-Requested-With": "XMLHttpRequest",
        },
        onUploadProgress: (progressEvent: ProgressEvent) => {
          const progress = (progressEvent.loaded / progressEvent.total) * 100;
          dispatch(uploadProgress({ file: file, progress: progress }));
        },
        cancelToken: cancelFn.token,
      };

      dispatch(queueUpload({ file, cancelFn }));

      const thenFn = (response: AxiosResponse) => {
        dispatch(uploadSuccess({ file, response }));
        if (onUpload) {
          onUpload(response, file);
        }
      };

      const catchFn = (error: AxiosError) => {
        if (error.message === CANCEL_MESSAGE) {
          dispatch(cancelUpload({ file }));
        } else {
          dispatch(uploadError({ file, error }));
          if (onError) {
            onError(error, file);
          }
        }
      };

      promisesQueue.push({ formData, config, thenFn, catchFn });
    }

    if (serial) {
      promisesQueue.reduce(async (previousPromise, nextPromise) => {
        await previousPromise;
        return axios
          .post(url, nextPromise.formData, nextPromise.config)
          .then(nextPromise.thenFn)
          .catch(nextPromise.catchFn);
      }, Promise.resolve());
    } else {
      promisesQueue.forEach((promise) => {
        axios
          .post(url, promise.formData, promise.config)
          .then(promise.thenFn)
          .catch(promise.catchFn);
      });
    }
  };

  const handleCancelUpload = (file: File, upload: Upload) => {
    upload.cancelFn.cancel(CANCEL_MESSAGE);
  };

  const handleRemoveUpload = (file: File, upload: Upload) => {
    dispatch(removeUpload({ file }));
    if (onDelete) {
      onDelete(state.uploadsResponse.get(file)!, file);
    }
  };

  const { getRootProps, getInputProps, open } = useDropzone({
    noClick: true,
    noKeyboard: true,
    onDropAccepted: handleUpload,
    accept: accept,
  });

  return (
    <Stack hasGutter>
      <StackItem>
        <EmptyState
          variant={EmptyStateVariant.small}
          {...getRootProps({
            className: styles.border,
          })}
        >
          <EmptyStateBody>Drag a file here or browse to upload.</EmptyStateBody>
          <Button variant="primary" onClick={open}>
            Browse
          </Button>
          <input {...getInputProps()} />
        </EmptyState>
      </StackItem>
      <StackItem>
        <Stack hasGutter>
          {Array.from(state.uploads.keys()).map((file: File, index) => {
            const upload = state.uploads.get(file)!;
            return (
              <StackItem key={index}>
                <Split>
                  <SplitItem isFilled>
                    <Progress
                      title={`${file.name}`}
                      label={
                        upload.status === "cancelled"
                          ? "Cancelled"
                          : upload.error
                          ? upload.error.message
                          : undefined
                      }
                      size={ProgressSize.sm}
                      value={upload.progress}
                      variant={
                        upload.status === "error" ||
                        upload.status === "cancelled"
                          ? ProgressVariant.danger
                          : upload.status === "success"
                          ? ProgressVariant.success
                          : undefined
                      }
                    />
                  </SplitItem>
                  <SplitItem>
                    {upload.status === "inProgress" && (
                      <Button
                        variant={ButtonVariant.plain}
                        aria-label="cancel"
                        onClick={() => handleCancelUpload(file, upload)}
                      >
                        <TimesIcon />
                      </Button>
                    )}
                    {((upload.status === "success" && onDelete) ||
                      upload.status === "error") && (
                      <Button
                        variant={ButtonVariant.plain}
                        aria-label="delete"
                        onClick={() => handleRemoveUpload(file, upload)}
                      >
                        <TrashIcon />
                      </Button>
                    )}
                  </SplitItem>
                </Split>
              </StackItem>
            );
          })}
        </Stack>
      </StackItem>
    </Stack>
  );
};
