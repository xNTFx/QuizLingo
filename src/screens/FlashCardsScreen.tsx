import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import { useGetVocabularyToReviewQuery } from "../API/Redux/reduxQueryFetch";
import BackFlashCard from "../features/FlashCardsScreen/components/BackFlashCard";
import FlashcardEndScreen from "../features/FlashCardsScreen/components/FlashcardEndScreen";
import FrontFlashCard from "../features/FlashCardsScreen/components/FrontFlashCard";
import NoVocabularyScreen from "../features/FlashCardsScreen/components/NoVocabularyScreen";
import useSuperMemo2Implementation from "../hooks/useSuperMemo2Implementation";
import { GetVocabularyToReviewType } from "../types/APITypes";

export default function FlashCardsScreen() {
  const { id, type } = useParams();
  const limit = 30;
  const { data, isLoading, error } = useGetVocabularyToReviewQuery({
    deckId: Number(id),
    limit: limit,
    type: type,
  });

  const [isFrontPage, setIsFrontPage] = useState(true);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [answerType, setAnswerType] = useState({
    easy: 0,
    normal: 0,
    good: 0,
    hard: 0,
    again: 0,
  });
  const [isEnd, setIsEnd] = useState(false);

  const [vocabularyList, setVocabularyList] = useState<
    GetVocabularyToReviewType[]
  >([]);
  const initialize = useRef(true);

  //Get static data
  useEffect(() => {
    if (data && initialize.current) {
      setVocabularyList(data);
      initialize.current = false;
    }
  }, [data]);

  const superMemo2Implementation = useSuperMemo2Implementation();

  function handleDifficulty(
    reviewId: number,
    vocabularyId: number,
    difficulty: string,
    ease_factor: number,
    repetition: number,
    quality: number,
  ) {
    if (!data) return;
    superMemo2Implementation(
      reviewId,
      vocabularyId,
      ease_factor,
      repetition,
      quality,
    );
    if (reviewIndex < vocabularyList?.length - 1) {
      setReviewIndex((prev) => (prev += 1));
      setIsFrontPage(true);
    }
    if (reviewIndex === vocabularyList?.length - 1) {
      setIsEnd(true);
    }
    setAnswerType((prev) => ({
      ...prev,
      [difficulty]: prev[difficulty as keyof typeof prev] + 1,
    }));
  }

  if (!data) return;
  const vocabulary = vocabularyList[reviewIndex];
  if (error) {
    console.error(error);
  }
  if (isLoading) return <div>Loading...</div>;

  if (vocabularyList.length === 0) return <NoVocabularyScreen />;

  return (
    <main className="flex h-[calc(100vh-3rem)] justify-center overflow-auto bg-[#1F1F1F] py-10">
      {!isEnd ? (
        <div
          className={`relative flex h-[90%] w-8/12 flex-col items-center rounded-xl text-white transition-all duration-500 [transform-style:preserve-3d] max-md:w-10/12 ${
            isFrontPage ? "" : "[transform:rotateY(180deg)]"
          }`}
        >
          <div className="absolute inset-0 [backface-visibility:hidden]">
            {isFrontPage ? (
              <FrontFlashCard
                vocabulary={vocabulary}
                setIsFrontPage={setIsFrontPage}
              />
            ) : null}
          </div>
          <div className="absolute inset-0 rounded-xl [transform:rotateY(180deg)] [backface-visibility:hidden]">
            {!isFrontPage ? (
              <BackFlashCard
                vocabulary={vocabulary}
                handleDifficulty={handleDifficulty}
              />
            ) : null}
          </div>
        </div>
      ) : (
        <FlashcardEndScreen answerType={answerType} />
      )}
    </main>
  );
}
