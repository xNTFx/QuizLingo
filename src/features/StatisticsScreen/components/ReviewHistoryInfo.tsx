interface ReviewHistoryInfoProps {
  currentReviewHistory: {
    ease_factor: number;
    quality: number;
    review_date: string;
  };
  vocabularyName: {
    frontWord: string | undefined;
    backWord: string | undefined;
  };
}

export function ReviewHistoryInfo({
  currentReviewHistory,
  vocabularyName,
}: ReviewHistoryInfoProps) {
  return (
    <div className="w-11/12 overflow-auto rounded-md bg-[#2C2C2C] p-4">
      <div className="flex flex-row gap-2">
        <h2 className="text-xl">Selected Vocabulary: </h2>
        <div className="flex flex-row items-center justify-center gap-1 text-xl">
          <p>{vocabularyName.frontWord}</p>
          <p>|</p>
          <p>{vocabularyName.backWord}</p>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div>
          <h2 className="flex items-center justify-center text-xl">
            Current values:
          </h2>
        </div>
        <div className="flex flex-row items-center justify-center gap-4">
          <p className="flex flex-col items-center justify-center">
            <span>Ease Factor: </span>
            <span>{currentReviewHistory.ease_factor.toFixed(1)}</span>
          </p>
          <p className="flex flex-col items-center justify-center">
            <span>Quality: </span>
            {currentReviewHistory.quality}
          </p>
          <p className="flex flex-col items-center justify-center">
            <span>Date: </span>
            {currentReviewHistory.review_date}
          </p>
        </div>
      </div>
    </div>
  );
}
