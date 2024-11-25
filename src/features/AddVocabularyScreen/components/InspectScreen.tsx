import { Editor } from "@tiptap/core";
import { useState } from "react";

import { GetVocabularyToReviewType } from "../../../types/APITypes";
import { transformFilePathToAudioElement } from "../../../utils/categorizeFileType";
import modifyHTMLAndCopyFiles from "../../../utils/modifyHTMLAndCopyFiles";
import BackFlashCard from "../../FlashCardsScreen/components/BackFlashCard";
import FrontFlashCard from "../../FlashCardsScreen/components/FrontFlashCard";

export default function InspectScreen({
  setIsInspected,
  editorsList,
}: {
  setIsInspected: React.Dispatch<React.SetStateAction<boolean>>;
  editorsList: Editor[];
}) {
  const [isFrontPage, setIsFrontPage] = useState(true);

  if (editorsList.length !== 5) return;

  const vocabulary: GetVocabularyToReviewType = {
    review_id: 0,
    review_date: new Date().toISOString(),
    ease_factor: 2.5,
    repetition: 1,
    vocabulary_id: 0,
    deck_id: 0,
    front_word: editorsList[0].getText().trim(),
    back_word: editorsList[1].getText().trim(),
    audio_name: transformFilePathToAudioElement(editorsList[2].getText()),
    front_word_html: modifyHTMLAndCopyFiles(editorsList[0].getHTML()),
    back_word_html: modifyHTMLAndCopyFiles(editorsList[1].getHTML()),
    front_desc_html: modifyHTMLAndCopyFiles(editorsList[3].getHTML()) ?? null,
    back_desc_html: modifyHTMLAndCopyFiles(editorsList[4].getHTML()) ?? null,
  };

  return (
    <div className="flex h-full flex-col justify-between">
      {isFrontPage ? (
        <FrontFlashCard
          vocabulary={vocabulary}
          setIsFrontPage={setIsFrontPage}
        />
      ) : (
        <BackFlashCard vocabulary={vocabulary} handleDifficulty={undefined} />
      )}
      <div className="mb-10 flex flex-row items-center justify-center">
        <button
          onClick={() => setIsInspected(false)}
          className="m-4 w-44 rounded-xl bg-blue-600 p-2 font-extrabold hover:opacity-60"
        >
          Close Preview
        </button>
        <button
          onClick={() => setIsFrontPage((prev) => !prev)}
          className="m-4 w-44 rounded-xl bg-green-600 p-2 font-extrabold hover:opacity-60"
        >
          Change Page
        </button>
      </div>
    </div>
  );
}
