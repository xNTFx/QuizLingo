import DOMPurify from "dompurify";
import { Dispatch } from "react";

import AudioButton from "../../../components/AudioButton";
import { GetVocabularyToReviewType } from "../../../types/APITypes";
import { extractSingleAudioAndImageSrc } from "../../../utils/extractAudioAndImageSrc";

interface FrontTranslationCardProps {
  vocabulary: GetVocabularyToReviewType;
  inputValue: string;
  setInputValue: Dispatch<React.SetStateAction<string>>;
  isInputErrorMessage: boolean;
  handleShowAnswer: (vocabulary: string) => void;
}

export default function FrontTranslationCard({
  vocabulary,
  inputValue,
  setInputValue,
  isInputErrorMessage,
  handleShowAnswer,
}: FrontTranslationCardProps) {
  const sanitizedFrontHtml = DOMPurify.sanitize(
    vocabulary.front_word_html ?? "",
  );
  const sanitizedFrontDescHtml = DOMPurify.sanitize(
    vocabulary.front_desc_html ?? "",
  );

  return (
    <article>
      <div className="flex h-[80vh] flex-col">
        <div className="h-full overflow-auto break-all rounded-t-lg bg-[#2C2C2C] p-6">
          <div className="flex w-full flex-col justify-center gap-4 text-center">
            <div dangerouslySetInnerHTML={{ __html: sanitizedFrontHtml }} />
            <AudioButton
              audioSrc={
                extractSingleAudioAndImageSrc(vocabulary.audio_name) ?? null
              }
            />
            <div dangerouslySetInnerHTML={{ __html: sanitizedFrontDescHtml }} />
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleShowAnswer(vocabulary.back_word);
          }}
        >
          <div className="flex flex-col items-center justify-center gap-1 rounded-b-lg bg-[#2C2C2C] pb-2">
            <div className="flex w-full items-center justify-center">
              <input
                value={inputValue}
                placeholder="Write a translation of the vocabulary"
                onChange={(e) => {
                  e.preventDefault();
                  setInputValue(e.target.value);
                }}
                className="h-10 w-3/5 rounded-md bg-black px-2"
              />
            </div>
            {isInputErrorMessage ? (
              <p className="rounded-md p-1 font-bold text-red-600">
                Input cannot be empty
              </p>
            ) : null}
          </div>

          <div className="mt-2 flex flex-row justify-center rounded-lg bg-black p-2">
            <button className="flex items-center justify-center rounded-lg border-2 border-solid border-white px-2 py-1 font-bold hover:bg-white hover:text-black">
              Show Answer
            </button>
          </div>
        </form>
      </div>
    </article>
  );
}
