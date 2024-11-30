import DataGrid from "react-data-grid";
import "react-data-grid/lib/styles.css";
import { MdDeleteForever } from "react-icons/md";

import LoadingDivComponent from "../../../components/LoadingComponents/LoadingDivComponent";
import { VocabularyType } from "../../../types/APITypes";

type Props = {
  data: VocabularyType[];
  handleScroll: (event: React.UIEvent<HTMLDivElement, UIEvent>) => void;
  handleChangeVocabulary: (vocabularyId: number) => void;
  removeVocabulary: (
    vocabularyId: number,
    data: VocabularyType[],
    setSelectedDeck: any,
  ) => void;
  setSelectedDeck: React.Dispatch<React.SetStateAction<VocabularyType | null>>;
  isLoading: boolean;
};

export default function VocabularyDataGrid({
  data,
  handleScroll,
  handleChangeVocabulary,
  removeVocabulary,
  setSelectedDeck,
  isLoading,
}: Props) {
  const columns = [
    {
      key: "remove_vocabulary_key",
      name: "",
      width: "0%",
    },
    {
      key: "front_word",
      name: "Front word",
      resizable: true,
      width: "40%",
    },
    { key: "back_word", name: "Back word", resizable: true, width: "40%" },
    { key: "deck_name", name: "Deck name", resizable: true },
  ];

  const rows = data.map((vocabulary) => ({
    id: vocabulary.vocabulary_id,
    remove_vocabulary_key: (
      <MdDeleteForever className="h-[60%] w-full cursor-pointer text-red-600 transition-transform hover:rotate-45" />
    ),
    front_word: vocabulary.front_word,
    back_word: vocabulary.back_word,
    deck_name: vocabulary.deck_name,
  }));

  if (isLoading) {
    return <LoadingDivComponent />;
  }

  return (
    <div className="overflow-y-auto h-full">
      <DataGrid
        style={{
          width: "100%",
          height: "100%",
          overflow: "auto",
        }}
        onScroll={handleScroll}
        onCellClick={(e) => {
          handleChangeVocabulary(e.row.id);
          if (e.column.key === "remove_vocabulary_key") {
            removeVocabulary(e.row.id, data, setSelectedDeck);
          }
        }}
        columns={columns}
        rows={rows}
      />
    </div>
  );
}
