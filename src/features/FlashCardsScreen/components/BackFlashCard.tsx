import DOMPurify from "dompurify";
import { extractSingleAudioAndImageSrc } from "../../../utils/extractAudioAndImageSrc";
import AudioButton from "../../../components/AudioButton";
import { GetVocabularyToReviewType } from "../../../types/APITypes";

interface BackFlashCardProps {
  vocabulary: GetVocabularyToReviewType;
  handleDifficulty: (
    reviewId: number,
    vocabularyId: number,
    difficulty: string,
    ease_factor: number,
    repetition: number,
    interval: number,
    quality: number
  ) => void;
}

export default function BackFlashCard({
  vocabulary,
  handleDifficulty,
}: BackFlashCardProps) {
  const sanitizedFrontHtml = DOMPurify.sanitize(vocabulary.front_word_html);
  const sanitizedFrontDescHtml = DOMPurify.sanitize(
    vocabulary.front_desc_html ?? ""
  );
  const sanitizedBack = DOMPurify.sanitize(
    vocabulary.back_word_html + vocabulary.back_desc_html
  );
  return (
    <article>
      <div className="flex h-full flex-col gap-2">
        <div className="h-full overflow-auto break-all rounded-lg bg-[#2C2C2C] p-6">
          <div className="flex w-full flex-col justify-center gap-4 text-center">
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
            <hr />
            <div
              dangerouslySetInnerHTML={{
                __html: sanitizedBack,
              }}
            />
          </div>
        </div>

        <div className="flex flex-row justify-center overflow-x-auto rounded-lg bg-black p-2">
          <div className="flex flex-row gap-4">
            <button
              onClick={() =>
                handleDifficulty(
                  vocabulary.review_id,
                  vocabulary.vocabulary_id,
                  "easy",
                  vocabulary.ease_factor,
                  vocabulary.repetition,
                  vocabulary.interval,
                  5
                )
              }
              className="flex items-center justify-center rounded-lg border-2 border-solid border-green-600 px-2 py-1 font-bold hover:bg-green-600"
            >
              Easy
            </button>
            <button
              onClick={() =>
                handleDifficulty(
                  vocabulary.review_id,
                  vocabulary.vocabulary_id,
                  "good",
                  vocabulary.ease_factor,
                  vocabulary.repetition,
                  vocabulary.interval,
                  4
                )
              }
              className="flex items-center justify-center rounded-lg border-2 border-solid border-gray-400 px-2 py-1 font-bold hover:bg-gray-400 hover:text-black"
            >
              Good
            </button>
            <button
              onClick={() =>
                handleDifficulty(
                  vocabulary.review_id,
                  vocabulary.vocabulary_id,
                  "hard",
                  vocabulary.ease_factor,
                  vocabulary.repetition,
                  vocabulary.interval,
                  3
                )
              }
              className="flex items-center justify-center rounded-lg border-2 border-solid border-orange-600 px-2 py-1 font-bold hover:bg-red-600"
            >
              Hard
            </button>
            <button
              onClick={() =>
                handleDifficulty(
                  vocabulary.review_id,
                  vocabulary.vocabulary_id,
                  "again",
                  vocabulary.ease_factor,
                  vocabulary.repetition,
                  vocabulary.interval,
                  0
                )
              }
              className="flex items-center justify-center rounded-lg border-2 border-solid border-red-600 px-2 py-1 font-bold hover:bg-orange-600"
            >
              Again
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
