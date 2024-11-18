interface HandleShowAnswerMessageProps {
  isFrontPage: boolean;
  correctVocabulary: string | null;
  inputValue: string;
}

export default function HandleShowAnswerMessage({
  isFrontPage,
  correctVocabulary,
  inputValue,
}: HandleShowAnswerMessageProps) {
  if (isFrontPage) return null;
  return (
    <article className="mb-2 flex w-8/12 flex-col items-center justify-start">
      <div className="flex w-full flex-col">
        {correctVocabulary === inputValue.trim() ? (
          <div className="rounded-md bg-green-200 p-2 font-bold text-green-700">
            <h2>Your Answer: {inputValue}</h2>
          </div>
        ) : (
          <div className="rounded-md bg-red-200 p-2 font-bold text-red-700">
            <h2>Your Answer: {inputValue}</h2>
          </div>
        )}
      </div>
    </article>
  );
}
