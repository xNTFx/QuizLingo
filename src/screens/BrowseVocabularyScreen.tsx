import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Split from "react-split";

import {
  useGetDecksQuery,
  useGetVocabularyQuery,
} from "../API/Redux/reduxQueryFetch";
import DeckSelectionContainer from "../components/DeckSelection/DeckSelectionContainer";
import LoadingDivComponent from "../components/LoadingComponents/LoadingDivComponent";
import LoadingPageComponent from "../components/LoadingComponents/LoadingPageComponent";
import NoDecksScreen from "../features/BrowseVocabularyScreen/components/NoDecksScreen";
import VocabularyDataGrid from "../features/BrowseVocabularyScreen/components/VocabularyDataGrid";
import VocabularySearchBar from "../features/BrowseVocabularyScreen/components/VocabularySearchBar";
import useSwalPopupBoxes from "../hooks/useSwalPopupBoxes";
import { VocabularyType } from "../types/APITypes";
import { extractSingleAudioAndImageSrc } from "../utils/extractAudioAndImageSrc";
import AddVocabularyScreen from "./AddVocabularyScreen";

export default function BrowseVocabularyScreen() {
  const { id } = useParams();
  const [inputSearchValue, setInputSearchValue] = useState("");
  const [debouncedSearchValue, setDebouncedSearchValue] = useState("");

  const itemHeight = 35;
  const initialLimit = Math.ceil(window.innerHeight / itemHeight) + 1;
  const [limit, setLimit] = useState(initialLimit);
  const [selectedVocabulary, setSelectedVocabulary] =
    useState<VocabularyType | null>(null);
  const [currentDeck, setCurrentDeck] = useState({ deckId: "0", deckName: "" });

  const { data, error, isLoading } = useGetVocabularyQuery({
    deckId: id !== "0" ? Number(id) : Number(currentDeck.deckId),
    limit,
    offset: 0,
    search: `%${debouncedSearchValue}%`,
  });

  // Ref for tracking whether there is more data to load
  const hasMore = useRef(true);

  const { removeVocabulary } = useSwalPopupBoxes();

  useEffect(() => {
    const handleResize = () => {
      const updatedLimit = Math.ceil(window.innerHeight / itemHeight) + 1;
      setLimit(updatedLimit);
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const initialized = useRef(false);

  useEffect(() => {
    if (data && data.length > 0 && !initialized.current) {
      const audioSrc =
        extractSingleAudioAndImageSrc(data[0].audio_name) || null;
      setSelectedVocabulary({ ...data[0], audio_name: audioSrc });
      initialized.current = true;
    }
  }, [data]);

  const handleScroll = (event: React.UIEvent<HTMLDivElement, UIEvent>) => {
    const { scrollTop, clientHeight, scrollHeight } = event.currentTarget;
    if (
      !isLoading &&
      hasMore.current &&
      data &&
      scrollTop + clientHeight >= scrollHeight
    ) {
      hasMore.current = data?.length % initialLimit === 0;
      setLimit((prevOffset) => prevOffset + initialLimit);
    }
  };

  function handleChangeVocabulary(vocabularyId: number) {
    const selectedVocabularyById = data?.find(
      (vocabulary: VocabularyType) => vocabulary.vocabulary_id === vocabularyId,
    );

    if (
      selectedVocabularyById &&
      selectedVocabulary &&
      selectedVocabularyById.vocabulary_id !==
        Number(selectedVocabulary.vocabulary_id)
    ) {
      const audioSrc =
        extractSingleAudioAndImageSrc(selectedVocabularyById.audio_name) ||
        null;
      setSelectedVocabulary({
        ...selectedVocabularyById,
        audio_name: audioSrc,
      });
    }
  }

  function handleSearchInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    setInputSearchValue(event?.target.value);
    setTimeout(() => {
      setDebouncedSearchValue(event?.target.value);
    }, 250);
  }

  const { data: deckList, isLoading: deckListIsLoading } = useGetDecksQuery();

  if (!data) return;
  if (error) {
    console.error(error);
  }
  if (isLoading)
    return (
      <div>
        <LoadingPageComponent />
      </div>
    );

  if (deckList?.length === 0 && !deckListIsLoading) {
    <NoDecksScreen />;
  }

  return (
    <main>
      <Split
        sizes={data.length > 0 ? [50, 50] : [100, 0]}
        className="flex flex-row justify-center bg-[#1F1F1F]"
        minSize={[100, 0]}
        maxSize={data.length > 0 ? [Infinity, Infinity] : [Infinity, 0]}
        expandToMin={false}
        gutterSize={10}
        gutterAlign="center"
        snapOffset={30}
        dragInterval={1}
        direction="horizontal"
      >
        <section className="mt-12 h-[calc(100vh-3rem)]">
          <div className="flex flex-col items-center">
            <div className="flex w-11/12 flex-col justify-start gap-4 rounded-lg bg-[#2C2C2C] p-4">
              {!deckListIsLoading ? (
                <DeckSelectionContainer
                  deckList={deckList}
                  selectedDeck={null}
                  id={id}
                  currentDeck={currentDeck}
                  setCurrentDeck={setCurrentDeck}
                  isInitialDeck={false}
                />
              ) : (
                <LoadingDivComponent />
              )}
              <VocabularySearchBar
                inputSearchValue={inputSearchValue}
                handleSearchInputChange={handleSearchInputChange}
              />
              {data.length > 0 ? (
                <VocabularyDataGrid
                  data={data}
                  handleScroll={handleScroll}
                  handleChangeVocabulary={handleChangeVocabulary}
                  removeVocabulary={removeVocabulary}
                  setSelectedDeck={setSelectedVocabulary}
                  isLoading={isLoading}
                />
              ) : (
                <div className="flex items-center justify-center text-xl">
                  <p>No vocabulary in a deck</p>
                </div>
              )}
            </div>
          </div>
        </section>
        {data.length > 0 ? (
          <section>
            <AddVocabularyScreen
              selectedDeck={selectedVocabulary ? selectedVocabulary : null}
            />
          </section>
        ) : null}
      </Split>
    </main>
  );
}
