import DataGrid from "react-data-grid";
import "react-data-grid/lib/styles.css";
import { MdDeleteForever } from "react-icons/md";

import LoadingDivComponent from "../../../components/LoadingComponents/LoadingDivComponent";
import { VocabularyType } from "../../../types/APITypes";

type Props = {
  data: VocabularyType[];
  handleScroll: (event: React.UIEvent<HTMLDivElement, UIEvent>) => void;
  handleChangeVocabulary: (vocabularyId: number) => void | undefined;
  removeVocabulary?: (
    vocabularyId: number,
    data: VocabularyType[],
    setSelectedDeck: React.Dispatch<
      React.SetStateAction<VocabularyType | null>
    >,
  ) => void;
  setSelectedVocabulary: React.Dispatch<
    React.SetStateAction<VocabularyType | null>
  >;
  isLoading: boolean;
};

export default function VocabularyDataGrid({
  data,
  handleScroll,
  handleChangeVocabulary,
  removeVocabulary,
  setSelectedVocabulary,
  isLoading,
}: Props) {
  const isRemoveVocabularyEnabled = removeVocabulary ? true : false;

  const columns = isRemoveVocabularyEnabled
    ? [
        {
          key: "remove_vocabulary_key",
          name: "",
          width: "5%",
        },
        {
          key: "front_word",
          name: "Front word",
          resizable: true,
          width: "auto",
        },
        { key: "back_word", name: "Back word", resizable: true, width: "auto" },
        {
          key: "deck_name",
          name: "Deck name",
          resizable: true,
          window: "auto",
        },
      ]
    : [
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
    remove_vocabulary_key: isRemoveVocabularyEnabled ? (
      <MdDeleteForever
        className="h-[60%] w-full cursor-pointer text-red-600 transition-transform hover:rotate-45"
        onClick={() => {
          if (removeVocabulary) {
            removeVocabulary(
              vocabulary.vocabulary_id,
              data,
              setSelectedVocabulary,
            );
          }
        }}
      />
    ) : null,
    front_word: vocabulary.front_word,
    back_word: vocabulary.back_word,
    deck_name: vocabulary.deck_name,
  }));

  if (isLoading) {
    return <LoadingDivComponent />;
  }

  return (
    <div className="h-full overflow-y-auto">
      <DataGrid
        style={{
          width: "100%",
          height: "100%",
          overflow: "auto",
        }}
        onScroll={handleScroll}
        onRowClick={(row) => {
          handleChangeVocabulary(row.id);
        }}
        onCellClick={(e) => {
          if (
            isRemoveVocabularyEnabled &&
            e.column.key === "remove_vocabulary_key"
          ) {
            if (removeVocabulary) {
              removeVocabulary(e.row.id, data, setSelectedVocabulary);
            }
          }
        }}
        columns={columns}
        rows={rows}
      />
    </div>
  );
}
