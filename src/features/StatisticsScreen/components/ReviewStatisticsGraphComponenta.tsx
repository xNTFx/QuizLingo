import { useState } from "react";

import { useGetReviewsHistoryQuery } from "../../../API/Redux/reduxQueryFetch";
import LoadingDivComponent from "../../../components/LoadingComponents/LoadingDivComponent";
import { VocabularyType } from "../../../types/APITypes";
import { ReviewHistoryGraph } from "./ReviewHistoryGraph";
import { ReviewHistoryInfo } from "./ReviewHistoryInfo";
import { StatisticsGraphFiltersSelection } from "./StatisticsGraphFiltersSelection ";

interface GraphFilterType {
  filterId: number;
  filterName: string;
}

export default function ReviewStatisticsGraphComponenta({
  vocabularyName,
  selectedVocabulary,
}: {
  vocabularyName: {
    frontWord: string | undefined;
    backWord: string | undefined;
  };
  selectedVocabulary?: VocabularyType | undefined | null;
}) {
  const [graphFilter, setGraphFilter] = useState<GraphFilterType>({
    filterId: 1,
    filterName: "Ease Factor",
  });

  const { data, isLoading } = useGetReviewsHistoryQuery({
    vocabularyId: selectedVocabulary?.vocabulary_id,
  });

  if (!data && isLoading) {
    return <LoadingDivComponent />;
  }

  if (!data || data?.length === 0) {
    return (
      <div>
        <h1>No review history for this vocabulary</h1>
      </div>
    );
  }

  const currentReviewHistory = data[data.length - 1];
  const reviewHistoryData = data.map((review, index) => ({
    reviewNumber: index + 1,
    easeFactor: review.ease_factor,
    quality: review.quality,
    reviewDate: review.review_date,
  }));

  return (
    <div className="flex flex-col items-center justify-center overflow-auto pt-12">
      <ReviewHistoryInfo
        currentReviewHistory={currentReviewHistory}
        vocabularyName={vocabularyName}
      />
      {data.length > 1 ? (
        <div className="mt-8 flex w-11/12 flex-col gap-4 rounded-md bg-[#2C2C2C] p-4">
          <h2 className="text-xl">Review History Graph</h2>
          <StatisticsGraphFiltersSelection
            graphFilter={graphFilter}
            setGraphFilter={setGraphFilter}
          />
          <ReviewHistoryGraph
            reviewHistoryData={reviewHistoryData}
            graphFilter={graphFilter}
          />
        </div>
      ) : (
        <div className="mt-4 p-2">
          To see Review History Graph you need to have at least 2 Review
          Histories
        </div>
      )}
    </div>
  );
}
