import useHandleVocabularyRemove from "../../../hooks/useHandleVocabularyRemove";
import { VocabularyType } from "../../../types/APITypes";
import { extractSingleAudioAndImageSrc } from "../../../utils/extractAudioAndImageSrc";

export default function useHandleVocabularyRemoveFunction() {
  const handleVocabularyRemove = useHandleVocabularyRemove();

  function findVocabularyById(vocabularyId: number, data: VocabularyType[]) {
    const vocabulary = data?.find((voc) => voc.vocabulary_id === vocabularyId);
    return vocabulary ? vocabulary : null;
  }

  function handleVocabularyRemoveFunction(
    rowId: number,
    data: VocabularyType[],
    setSelectedDeck: React.Dispatch<React.SetStateAction<VocabularyType | null>>
  ) {
    handleVocabularyRemove(findVocabularyById(rowId, data));
    if (data && data.length > 1) {
      const prevVocabularyIndex = data.findIndex(
        (voc) => voc.vocabulary_id === rowId
      );
      const currentVocabularyIndex =
        prevVocabularyIndex + 1 > data.length - 1
          ? prevVocabularyIndex - 1
          : prevVocabularyIndex + 1;
      const audioSrc =
        extractSingleAudioAndImageSrc(
          data[currentVocabularyIndex].audio_name
        ) || null;
      setSelectedDeck({
        ...data[currentVocabularyIndex],
        audio_name: audioSrc,
      });
    }
  }
  return handleVocabularyRemoveFunction;
}
