import { useRef, useState } from "react";

import { useUpdateDeckImgMutation } from "../../../API/Redux/reduxQueryFetch";
import { InfoBox } from "../../../components/InfoBox";
import useSwalPopupBoxes from "../../../hooks/useSwalPopupBoxes";
import { GetDeckWithCountType } from "../../../types/APITypes";
import isItImageFile from "../../../utils/categorizeFileType";
import {
  handleCheckIfFileExists,
  handleFileCopied,
} from "../../../utils/handleFileLogic";
import DeckImage from "./DeckImage";

interface ChangeImageBoxProps {
  setIsChangeImageBoxOpen: (isOpen: boolean) => void;
  selectedDeck: GetDeckWithCountType | null;
}

export default function ChangeImageBox({
  setIsChangeImageBoxOpen,
  selectedDeck,
}: ChangeImageBoxProps) {
  const [currentFile, setCurrentFile] = useState<{
    file: File;
    path: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [updateDeckImg] = useUpdateDeckImgMutation();
  const { errorAlert } = useSwalPopupBoxes();

  const directoryName = "dataResources/mediaFiles/deckImages/";

  async function checkImageFile(file: File | null) {
    if (!file) {
      errorAlert("Error, no file selected", "error");
      return;
    }

    const fileExists = await handleCheckIfFileExists(file.name, "deckImages");

    if (fileExists === false) {
      setCurrentFile(null);
      return;
    }
    if (fileExists === true) {
      const newFile = {
        file,
        path: `${directoryName}${file.name}`,
      };
      setCurrentFile(newFile);
      return;
    }

    const filePath = file.path.replace(/\\/g, "/");
    const localFileUrl = filePath ? `local-file:///${filePath}` : "";

    if (isItImageFile(file.name)) {
      const newFile = {
        file,
        path: localFileUrl,
      };
      setCurrentFile(newFile);
    } else {
      errorAlert("File is not an image", "error");
    }
  }

  function SquareImage() {
    return (
      <div className="mt-4 text-xs">
        <div className="flex flex-col items-center justify-center">
          <div className="relative flex h-[64px] w-[64px] flex-row items-end rounded">
            {currentFile ? (
              <img
                src={currentFile.path}
                className="h-[64px] w-[64px] rounded object-cover"
                alt="Selected file preview"
              />
            ) : (
              <DeckImage deckImg={selectedDeck?.deck_img} />
            )}
            <div className="absolute top-[-18px]">
              <p>64px</p>
            </div>
            <div className="h-1 rotate-90">
              <p className="absolute bottom-1 right-0">64px</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
      <InfoBox onClickOutside={() => setIsChangeImageBoxOpen(false)}>
        <div className="pointer-events-auto flex h-[25rem] w-[25rem] flex-col items-center gap-6 rounded bg-[#2C2C2C] p-4 text-white">
          <h2 className="text-xl font-bold">Deck Image Selection</h2>
          <div className="h-full">
            <SquareImage />
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="pt-6">
                <button
                  title="Upload image"
                  onClick={() => fileInputRef.current?.click()}
                  className="m-1 rounded bg-black p-2 font-bold text-white hover:bg-blue-400 hover:text-white"
                >
                  Upload Image
                </button>
                <input
                  ref={fileInputRef}
                  onChange={(e) => {
                    const file = e.target.files ? e.target.files[0] : null;
                    if (file) {
                      checkImageFile(file);
                    }
                    e.target.value = "";
                  }}
                  type="file"
                  accept="image/*"
                  className="hidden"
                />
              </div>
              <div className="max-w-[22rem] overflow-x-auto">
                <p className="max-w-[95%] whitespace-nowrap">
                  {currentFile?.file.name || "No file selected"}
                </p>
              </div>
            </div>
          </div>
          <p>
            The Image in the deck is 64 pixels by 64 pixels, other image sizes
            may result in an indistinct image
          </p>
          <div className="flex w-full justify-evenly">
            <button
              onClick={() => {
                if (!currentFile?.path) {
                  console.error("currentFile or its path is not defined");
                  return;
                }

                const normalizedPath = currentFile.path.replace(/\\/g, "/");
                const fileName = normalizedPath.split("/").pop();
                if (!fileName) {
                  console.error("File name could not be extracted");
                  return;
                }

                const newPath = `${directoryName}${fileName}`;

                handleFileCopied(newPath, "deckImages", normalizedPath);
                if (
                  selectedDeck?.deck_id &&
                  currentFile &&
                  currentFile.path !== ""
                ) {
                  updateDeckImg({
                    deck_id: selectedDeck.deck_id,
                    deck_img: currentFile.path,
                  });
                } else {
                  errorAlert("Deck id does not exist", "error");
                }
                setIsChangeImageBoxOpen(false);
              }}
              className="w-20 rounded-sm bg-green-500 p-1 hover:opacity-60"
            >
              Ok
            </button>
            <button
              onClick={() => setIsChangeImageBoxOpen(false)}
              className="w-20 rounded-sm bg-blue-500 p-1 hover:opacity-60"
            >
              Cancel
            </button>
          </div>
        </div>
      </InfoBox>
    </div>
  );
}
