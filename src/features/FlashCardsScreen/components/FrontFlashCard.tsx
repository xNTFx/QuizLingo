import DOMPurify from "dompurify";
import { Dispatch } from "react";

import AudioButton from "../../../components/AudioButton";
import {
  GetVocabularyToReviewType,
  VocabularyType,
} from "../../../types/APITypes";
import { extractSingleAudioAndImageSrc } from "../../../utils/extractAudioAndImageSrc";

interface FrontFlashCardProps {
  vocabulary: GetVocabularyToReviewType | VocabularyType;
  setIsFrontPage: Dispatch<React.SetStateAction<boolean>>;
}

export default function FrontFlashCard({
  vocabulary,
  setIsFrontPage,
}: FrontFlashCardProps) {
  const sanitizedFrontHtml = DOMPurify.sanitize(vocabulary.front_word_html);
  const sanitizedFrontDescHtml = DOMPurify.sanitize(
    vocabulary.front_desc_html ?? "",
  );
  return (
    <article className="h-[80vh] w-full">
      <div className="flex h-full flex-col items-center justify-center gap-2">
        <div className="flex h-full w-11/12 flex-col items-center justify-center overflow-auto break-all rounded-lg bg-[#2C2C2C] p-6">
          <div className="flex w-full flex-col gap-1">
            <div dangerouslySetInnerHTML={{ __html: sanitizedFrontHtml }} />
            <AudioButton
              audioSrc={extractSingleAudioAndImageSrc(vocabulary.audio_name)}
            />
            <div dangerouslySetInnerHTML={{ __html: sanitizedFrontDescHtml }} />
          </div>
        </div>

        <div className="flex h-14 w-11/12 flex-row justify-center overflow-auto rounded-lg bg-black p-2">
          <div className="flex flex-row gap-4">
            <button
              onClick={() => setIsFrontPage(false)}
              className="flex w-full items-center justify-center rounded-lg border-2 border-solid border-white px-2 py-1 font-bold hover:bg-white hover:text-black"
            >
              Show Answer
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
