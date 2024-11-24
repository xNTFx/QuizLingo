import "@sweetalert2/theme-dark/dark.css";
import { Editor } from "@tiptap/core";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import Swal from "sweetalert2/dist/sweetalert2.min.js";

function errorAlert(errorName: string, icon: string) {
  const title = icon.slice(0, 1).toUpperCase() + icon.slice(1);
  Swal.fire({
    title: title,
    text: errorName,
    icon: icon,
    confirmButtonColor: "#3085d6",
  });
}

let removehandleFileInsertListener: (() => void) | null = null;
export function handleFileInsert(file: File | null, editor: Editor) {
  if (file) {
    const filePath = file.path.replace(/\\/g, "/");
    const localFileUrl = `local-file:///${filePath}`;

    if (window.electronAPI) {
      let fileType = "";
      if (file.type.startsWith("image/")) {
        fileType = "images";
      } else {
        errorAlert("File is not an image", "error");
      }

      window.electronAPI.send("handle-image-insert", {
        filePath: file.path,
        uniqueFilename: file.name,
        fileType: fileType,
      });

      if (removehandleFileInsertListener) {
        removehandleFileInsertListener();
      }

      removehandleFileInsertListener = window.electronAPI.receive(
        "image-inserted",
        (success: boolean, message: string) => {
          if (success) {
            switch (message) {
              case "insert-existing-file":
                if (fileType === "images") {
                  editor.commands.setImage({
                    src: `dataResources/mediaFiles/${fileType}/${file.name}`,
                    alt: `dataResources/mediaFiles/${fileType}/${file.name}`,
                  });
                }
                break;
              case "insert-image-to-editor":
                if (fileType === "images") {
                  editor.commands.setImage({
                    src: localFileUrl,
                    alt: `dataResources/mediaFiles/${fileType}/${file.name}`,
                  });
                }
                break;
            }
          } else {
            console.error("Error during image insertion");
          }
        },
      ) as () => void;
    } else {
      console.error("No file provided or file is null.");
    }
  }
}

let removeFileCopiedListener: (() => void) | null = null;

export function handleFileCopied(
  fileName: string,
  fileType: string | undefined,
  filePath: string | undefined,
) {
  if (fileName && fileType && filePath) {
    if (window.electronAPI) {
      window.electronAPI.send("copy-file-to-public", {
        filePath: filePath.replace("local-file:///", ""),
        uniqueFilename: fileName,
        fileType: fileType,
      });

      if (removeFileCopiedListener) {
        removeFileCopiedListener();
      }

      removeFileCopiedListener = window.electronAPI.receive(
        "file-copied",
        (success: boolean) => {
          if (success) {
            if (removeFileCopiedListener) removeFileCopiedListener();
            removeFileCopiedListener = null;
          }
        },
      ) as () => void;
    }
  }
}

let removeFileRemovedListener: (() => void) | null = null;
export function handleFileRemove(value: string) {
  const file = value;
  if (file) {
    if (window.electronAPI) {
      window.electronAPI.send("remove-file-from-public", {
        uniqueFilename: file,
      });

      if (removeFileRemovedListener) {
        removeFileRemovedListener();
      }

      removeFileRemovedListener = window.electronAPI.receive(
        "file-removed",
        (success: boolean) => {
          if (success) {
            if (removeFileRemovedListener) removeFileRemovedListener();
            removeFileRemovedListener = null;
          } else {
            console.error("Error copying file");
          }
        },
      ) as () => void;
    } else {
      console.error("IPC renderer is not available in this context.");
    }
  }
}

export async function handleGetAllFiles() {
  if (window.electronAPI) {
    try {
      const list = await window.electronAPI.invoke("get-all-files-from-public");
      return list;
    } catch (error) {
      console.error("Error getting files:", error);
      return [];
    }
  } else {
    console.error("electronAPI is not available.");
    return [];
  }
}

let removehandleCheckIfFileExists: (() => void) | null = null;
export async function handleCheckIfFileExists(
  file: string | null,
  directoryName?: string,
) {
  const fileName = file?.split("\\").slice(-1)[0];
  if (fileName) {
    await window.electronAPI.send("check-if-file-exists", {
      uniqueFilename: fileName,
      directoryName,
    });

    if (removehandleCheckIfFileExists) {
      removehandleCheckIfFileExists();
    }

    return new Promise((resolve) => {
      removehandleCheckIfFileExists = window.electronAPI.receive(
        "file-exists",
        (success: boolean) => {
          resolve(success);
        },
      );
    });
  } else {
    console.error("No file provided or file is null.");
    return false;
  }
}
