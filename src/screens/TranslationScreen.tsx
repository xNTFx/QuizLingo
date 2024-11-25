import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import { useGetVocabularyToReviewQuery } from "../API/Redux/reduxQueryFetch";
import BackTranslationCard from "../features/TranslationScreen/components/BackTranslationCard";
import DefaultEndScreen from "../features/TranslationScreen/components/DefaultEndScreen";
import FrontTranslationCard from "../features/TranslationScreen/components/FrontTranslationCard";
import HandleShowAnswerMessage from "../features/TranslationScreen/components/HandleShowAnswerMessage";
import NoVocabularyScreen from "../features/TranslationScreen/components/NoVocabularyScreen";
import useSuperMemo2Implementation from "../hooks/useSuperMemo2Implementation";
import { GetVocabularyToReviewType } from "../types/APITypes";

export default function TranslationScreen() {
  const { id, type } = useParams();
  const limit = 30;
  const { data, isLoading, error } = useGetVocabularyToReviewQuery({
    deckId: Number(id),
    limit: limit,
    type: type,
  });
  const [isFrontPage, setIsFrontPage] = useState(true);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [answerType, setAnswerType] = useState({ wrong: 0, correct: 0 });
  const [isEnd, setIsEnd] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [correctVocabulary, setCorrectVocabulary] = useState<string | null>(
    null,
  );
  const [isInputErrorMessage, setIsInputErrorMessage] = useState(false);

  const superMemo2Implementation = useSuperMemo2Implementation();

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

  if (!data) return;
  const vocabulary = vocabularyList[reviewIndex];

  function handleShowAnswer(backWord: string) {
    const isAnswerCorrect = inputValue.trim() === vocabulary.back_word;

    if (inputValue.trim().length > 0) {
      if (isAnswerCorrect) {
        superMemo2Implementation(
          vocabulary.review_id,
          vocabulary.vocabulary_id,
          vocabulary.ease_factor,
          vocabulary.repetition,
          5,
        );
      } else {
        superMemo2Implementation(
          vocabulary.review_id,
          vocabulary.vocabulary_id,
          vocabulary.ease_factor,
          vocabulary.repetition,
          2,
        );
      }

      setIsFrontPage(false);
      setCorrectVocabulary(backWord);
      if (isInputErrorMessage) {
        setIsInputErrorMessage(false);
      }
    } else {
      setIsInputErrorMessage(true);
    }
  }

  function handleNextVocabulary() {
    const isAnswerCorrect = inputValue.trim() === vocabulary?.back_word;

    const difficulty = isAnswerCorrect ? "correct" : "wrong";
    setAnswerType((prev) => ({
      ...prev,
      [difficulty]: prev[difficulty as keyof typeof prev] + 1,
    }));
    if (reviewIndex < vocabularyList?.length - 1) {
      setReviewIndex((prev) => (prev += 1));
      setIsFrontPage(true);
      setInputValue("");
    }
    if (reviewIndex === vocabularyList?.length - 1) {
      setIsEnd(true);
    }
  }

  if (vocabularyList.length === 0) return <NoVocabularyScreen />;

  if (error) {
    console.error(error);
  }
  if (isLoading) return <div>Loading...</div>;

  return (
    <main className="flex h-[calc(100vh-3rem)] flex-col items-center justify-center overflow-auto bg-[#1F1F1F] py-10">
      {!isEnd ? (
        <>
          {isFrontPage ? null : (
            <HandleShowAnswerMessage
              isFrontPage={isFrontPage}
              correctVocabulary={correctVocabulary}
              inputValue={inputValue}
            />
          )}
          <div
            className={`relative flex h-full w-8/12 flex-col items-center rounded-xl text-white transition-all duration-500 [transform-style:preserve-3d] ${
              isFrontPage ? "" : "[transform:rotateY(180deg)]"
            }`}
          >
            <div className="absolute inset-0 [backface-visibility:hidden]">
              {isFrontPage ? (
                <FrontTranslationCard
                  vocabulary={vocabulary}
                  inputValue={inputValue}
                  setInputValue={setInputValue}
                  isInputErrorMessage={isInputErrorMessage}
                  handleShowAnswer={handleShowAnswer}
                />
              ) : null}
            </div>
            <div className="absolute inset-0 rounded-xl [backface-visibility:hidden] [transform:rotateY(180deg)]">
              {!isFrontPage ? (
                <BackTranslationCard
                  vocabulary={vocabulary}
                  handleNextVocabulary={handleNextVocabulary}
                />
              ) : null}
            </div>
          </div>
        </>
      ) : (
        <DefaultEndScreen answerType={answerType} />
      )}
    </main>
  );
}
