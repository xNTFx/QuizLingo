import DOMPurify from "dompurify";
import { Dispatch } from "react";

import AudioButton from "../../../components/AudioButton";
import { GetVocabularyToReviewType } from "../../../types/APITypes";
import { extractSingleAudioAndImageSrc } from "../../../utils/extractAudioAndImageSrc";

interface FrontFlashCardProps {
  vocabulary: GetVocabularyToReviewType;
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
    <article>
      <div className="flex h-full flex-col gap-2">
        <div className="h-full overflow-auto break-all rounded-lg bg-[#2C2C2C] p-6">
          <div className="flex w-full flex-col justify-center gap-4 text-center">
            <div dangerouslySetInnerHTML={{ __html: sanitizedFrontHtml }} />
            <AudioButton
              audioSrc={extractSingleAudioAndImageSrc(vocabulary.audio_name)}
            />
            <div dangerouslySetInnerHTML={{ __html: sanitizedFrontDescHtml }} />
          </div>
        </div>

        <div className="flex flex-row justify-center overflow-x-auto rounded-lg bg-black p-2">
          <div className="flex flex-row gap-4">
            <button
              onClick={() => setIsFrontPage(false)}
              className="flex items-center justify-center rounded-lg border-2 border-solid border-white px-2 py-1 font-bold hover:bg-white hover:text-black"
            >
              Show Answer
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
