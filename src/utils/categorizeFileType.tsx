import { handleFileCopied } from "./handleFileLogic";

function categorizeFileType(fileName: string) {
  const extension = fileName.split(".").pop()?.toLowerCase();

  switch (extension?.toLowerCase()) {
    case "png":
    case "jpg":
    case "jpeg":
    case "gif":
    case "bmp":
    case "svg":
    case "webp":
    case "ico":
    case "avif":
      return "images";
    case "mp3":
    case "wav":
    case "aac":
    case "ogg":
    case "flac":
    case "m4a":
    case "opus":
      return "audio";

    // potencjalne wsparcie dla wideo:
    // case 'mp4':
    // case 'avi':
    // case 'mov':
    // case 'wmv':
    // case 'mkv':
    // case 'webm':
    // case 'flv':
    //   return 'movies';

    default:
      return undefined;
  }
}

function isItAudioFile(fileName: string | null) {
  const extension = fileName?.split(".").pop()?.toLowerCase();

  switch (extension) {
    case "mp3":
    case "wav":
    case "aac":
    case "ogg":
    case "flac":
    case "m4a":
    case "opus":
      return true;
    default:
      return false;
  }
}

export default function isItImageFile(fileName: string) {
  const extension = fileName.split(".").pop()?.toLowerCase();

  switch (extension) {
    case "png":
    case "jpg":
    case "jpeg":
    case "gif":
    case "bmp":
    case "svg":
    case "webp":
    case "ico":
    case "avif":
      return true;
    default:
      return false;
  }
}

function transformFilePathToAudioElement(filePath: string | null | undefined) {
  if (!filePath) return "";

  const directoryName = "dataResources/mediaFiles/audio/";

  const fileName = filePath.split("\\").pop()?.replace(directoryName, "");
  const newPath = `${directoryName}${fileName}`;

  if (fileName) {
    handleFileCopied(newPath, "audio", filePath);
  }

  return `<audio src="${newPath}" />`;
}

export { categorizeFileType, transformFilePathToAudioElement, isItAudioFile };
