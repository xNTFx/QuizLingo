import { Editor } from "@tiptap/core";

import {
  handleCheckIfFileExists,
  handleFileCopied,
  handleFileInsert,
  handleFileRemove,
  handleGetAllFiles,
} from "../utils/handleFileLogic";

const mockElectronAPI = {
  send: jest.fn(),
  receive: jest.fn(),
  invoke: jest.fn(),
};

Object.defineProperty(window, "electronAPI", {
  value: mockElectronAPI,
  writable: true,
});

jest.mock("sweetalert2", () => ({
  fire: jest.fn(),
}));

function normalizePath(path: string | undefined): string {
  return path ? path.replace(/\\/g, "/") : "";
}

describe("File handling functions", () => {
  const mockEditor = {
    commands: {
      setImage: jest.fn(),
    },
  } as unknown as Editor;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  describe("handleFileInsert", () => {
    it("should insert an image if the file is of image type", () => {
      const mockFile = {
        path: "C:\\example\\image.jpg",
        name: "image.jpg",
        type: "image/jpeg",
      } as File;

      mockElectronAPI.send.mockImplementation((_event, data) => {
        if (data.filePath) data.filePath = normalizePath(data.filePath);
      });

      mockElectronAPI.receive.mockImplementation((_, callback) => {
        callback(true, "insert-existing-file");
        return jest.fn();
      });

      handleFileInsert(mockFile, mockEditor);

      expect(mockElectronAPI.send).toHaveBeenCalledWith(
        "handle-image-insert",
        expect.objectContaining({
          filePath: "C:/example/image.jpg",
          uniqueFilename: mockFile.name,
          fileType: "images",
        }),
      );
    });
  });

  describe("handleFileCopied", () => {
    it("should send a copy file to public event", () => {
      const mockFilePath = "C:\\example\\file.txt";

      mockElectronAPI.send.mockImplementation((_event, data) => {
        if (data.filePath) data.filePath = normalizePath(data.filePath);
      });

      handleFileCopied("file.txt", "documents", mockFilePath);

      expect(mockElectronAPI.send).toHaveBeenCalledWith(
        "copy-file-to-public",
        expect.objectContaining({
          filePath: "C:/example/file.txt",
          uniqueFilename: "file.txt",
          fileType: "documents",
        }),
      );
    });
  });

  describe("handleGetAllFiles", () => {
    it("should fetch all files from public directory", async () => {
      mockElectronAPI.invoke.mockResolvedValue(["file1.txt", "file2.txt"]);

      const files = await handleGetAllFiles();

      expect(files).toEqual(["file1.txt", "file2.txt"]);
      expect(mockElectronAPI.invoke).toHaveBeenCalledWith(
        "get-all-files-from-public",
      );
    });

    it("should return an empty array if there is an error", async () => {
      mockElectronAPI.invoke.mockRejectedValue(new Error("Error"));

      const files = await handleGetAllFiles();

      expect(files).toEqual([]);
      expect(console.error).toHaveBeenCalledWith(
        "Error getting files:",
        expect.any(Error),
      );
    });
  });

  describe("handleFileRemove", () => {
    it("should send a remove file from public event", () => {
      handleFileRemove("file.txt");

      expect(mockElectronAPI.send).toHaveBeenCalledWith(
        "remove-file-from-public",
        { uniqueFilename: "file.txt" },
      );
    });
  });

  describe("handleCheckIfFileExists", () => {
    it("should check if a file exists", async () => {
      const mockFilePath = "C:\\example\\file.txt";

      mockElectronAPI.receive.mockImplementation((_, callback) => {
        callback(true);
        return jest.fn();
      });

      const exists = await handleCheckIfFileExists(mockFilePath);

      expect(exists).toBe(true);
      expect(mockElectronAPI.send).toHaveBeenCalledWith(
        "check-if-file-exists",
        expect.objectContaining({
          uniqueFilename: "file.txt",
          directoryName: undefined,
        }),
      );
    });

    it("should return null if file name is null", async () => {
      const exists = await handleCheckIfFileExists(null);

      expect(exists).toBeNull();
      expect(console.error).toHaveBeenCalledWith(
        "No file provided or file is null.",
      );
    });
  });
});
