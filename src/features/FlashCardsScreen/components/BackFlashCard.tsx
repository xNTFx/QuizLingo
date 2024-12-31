import DOMPurify from "dompurify";

import AudioButton from "../../../components/AudioButton";
import { GetVocabularyToReviewType } from "../../../types/APITypes";
import { extractSingleAudioAndImageSrc } from "../../../utils/extractAudioAndImageSrc";

interface BackFlashCardProps {
  vocabulary: GetVocabularyToReviewType;
  handleDifficulty?: (
    reviewId: number,
    vocabularyId: number,
    difficulty: string,
    ease_factor: number,
    repetition: number,
    quality: number,
  ) => void;
}

export default function BackFlashCard({
  vocabulary,
  handleDifficulty,
}: BackFlashCardProps) {
  const sanitizedFrontHtml = DOMPurify.sanitize(vocabulary.front_word_html);
  const sanitizedFrontDescHtml = DOMPurify.sanitize(
    vocabulary.front_desc_html ?? "",
  );
  const sanitizedBack = DOMPurify.sanitize(
    vocabulary.back_word_html + vocabulary.back_desc_html,
  );

  const handleButtonClick = (difficulty: string, quality: number) => {
    if (handleDifficulty) {
      handleDifficulty(
        vocabulary.review_id,
        vocabulary.vocabulary_id,
        difficulty,
        vocabulary.ease_factor,
        vocabulary.repetition,
        quality,
      );
    }
  };

  return (
    <article className="h-[80vh]">
      <div className="flex h-full w-full flex-col items-center justify-center gap-2">
        <div className="h-full w-11/12 overflow-auto rounded-lg bg-[#2C2C2C] p-6">
          <div className="flex h-full flex-col justify-center gap-4 text-center">
            <div className="flex h-1/2 flex-col gap-1 overflow-auto">
              <div
                dangerouslySetInnerHTML={{
                  __html: sanitizedFrontHtml,
                }}
              />
              <AudioButton
                audioSrc={extractSingleAudioAndImageSrc(vocabulary.audio_name)}
              />
              <div
                dangerouslySetInnerHTML={{
                  __html: sanitizedFrontDescHtml,
                }}
              />
            </div>
            <hr />
            <div className="flex h-1/2 flex-col gap-1 overflow-auto">
              <div
                dangerouslySetInnerHTML={{
                  __html: sanitizedBack,
                }}
              />
            </div>
          </div>
        </div>
        <div className="flex h-14 w-11/12 flex-row justify-center rounded-lg bg-black p-2">
          <div className="flex flex-row gap-4">
            <button
              onClick={() => handleButtonClick("easy", 5)}
              className="flex w-20 items-center justify-center rounded-lg border-2 border-solid border-green-600 px-2 py-1 font-bold hover:bg-green-600"
            >
              Easy
            </button>
            <button
              onClick={() => handleButtonClick("good", 4)}
              className="flex w-20 items-center justify-center rounded-lg border-2 border-solid border-gray-400 px-2 py-1 font-bold hover:bg-gray-400 hover:text-black"
            >
              Good
            </button>
            <button
              onClick={() => handleButtonClick("hard", 2)}
              className="flex w-20 items-center justify-center rounded-lg border-2 border-solid border-orange-600 px-2 py-1 font-bold hover:bg-red-600"
            >
              Hard
            </button>
            <button
              onClick={() => handleButtonClick("again", 0)}
              className="flex w-20 items-center justify-center rounded-lg border-2 border-solid border-red-600 px-2 py-1 font-bold hover:bg-orange-600"
            >
              Again
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
