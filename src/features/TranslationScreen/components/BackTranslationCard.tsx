import DOMPurify from "dompurify";
import { extractSingleAudioAndImageSrc } from "../../../utils/extractAudioAndImageSrc";
import AudioButton from "../../../components/AudioButton";
import { GetVocabularyToReviewType } from "../../../types/APITypes";

interface BackTranslationCardProps {
  vocabulary: GetVocabularyToReviewType;
  handleNextVocabulary: () => void;
}

export default function BackTranslationCard({
  vocabulary,
  handleNextVocabulary,
}: BackTranslationCardProps) {
  const sanitizedFrontHtml = DOMPurify.sanitize(vocabulary.front_word_html);
  const sanitizedFrontDescHtml = DOMPurify.sanitize(
    vocabulary.front_desc_html ?? ""
  );
  const sanitizedBack = DOMPurify.sanitize(
    vocabulary.back_word_html +
      (vocabulary.back_desc_html ? vocabulary.back_desc_html : "")
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

        <div className="flex flex-row justify-center rounded-lg bg-black p-2">
          <button
            onClick={handleNextVocabulary}
            className="flex items-center justify-center rounded-lg border-2 border-solid border-green-600 px-2 py-1 font-bold hover:bg-green-600"
          >
            Next
          </button>
        </div>
      </div>
    </article>
  );
}
