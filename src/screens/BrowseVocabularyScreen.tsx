import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Split from "react-split";

import { useGetVocabularyQuery } from "../API/Redux/reduxQueryFetch";
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

  const { data, error, isLoading } = useGetVocabularyQuery({
    deckId: Number(id),
    limit,
    offset: 0,
    search: `%${debouncedSearchValue}%`,
  });

  const [selectedDeck, setSelectedDeck] = useState<VocabularyType | null>(null);

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
      setSelectedDeck({ ...data[0], audio_name: audioSrc });
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
    const selectedVocabulary = data?.find(
      (vocabulary: VocabularyType) => vocabulary.vocabulary_id === vocabularyId,
    );

    if (
      selectedVocabulary &&
      selectedDeck &&
      selectedVocabulary.vocabulary_id !== Number(selectedDeck.vocabulary_id)
    ) {
      const audioSrc =
        extractSingleAudioAndImageSrc(selectedVocabulary.audio_name) || null;
      setSelectedDeck({ ...selectedVocabulary, audio_name: audioSrc });
    }
  }

  function handleSearchInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    setInputSearchValue(event?.target.value);
    setTimeout(() => {
      setDebouncedSearchValue(event?.target.value);
    }, 500);
  }

  if (!data) return;
  if (error) {
    console.error(error);
  }
  if (isLoading) return <div>Loading...</div>;

  return (
    <main>
      <Split
        sizes={data.length > 0 ? [50, 50] : [100, 0]}
        className="flex flex-row justify-center bg-[#1F1F1F]"
        minSize={0}
        expandToMin={false}
        gutterSize={10}
        gutterAlign="center"
        snapOffset={30}
        dragInterval={1}
        direction="horizontal"
      >
        <section className="mt-12 h-[calc(100vh-3rem)]">
          <div className="flex flex-col items-center justify-center">
            <div className="flex w-11/12 flex-col items-center justify-center gap-4 rounded-lg bg-[#2C2C2C] p-4">
              <VocabularySearchBar
                inputSearchValue={inputSearchValue}
                handleSearchInputChange={handleSearchInputChange}
              />
              <VocabularyDataGrid
                data={data}
                handleScroll={handleScroll}
                handleChangeVocabulary={handleChangeVocabulary}
                removeVocabulary={removeVocabulary}
                setSelectedDeck={setSelectedDeck}
                isLoading={isLoading}
              />
            </div>
          </div>
        </section>
        {data.length > 0 ? (
          <section>
            <AddVocabularyScreen
              selectedDeck={selectedDeck ? selectedDeck : null}
            />
          </section>
        ) : null}
      </Split>
    </main>
  );
}
