import { Editor } from "@tiptap/core";
import { useCallback, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useGetDecksQuery } from "../API/Redux/reduxQueryFetch";
import DeckSelectionContainer from "../components/DeckSelection/DeckSelectionContainer";
import NoDeckScreen from "../features/AddVocabularyScreen/components/NoDeckScreen";
import VocabularyEditor from "../features/AddVocabularyScreen/components/VocabularyEditor";
import useInsertOrUpdateVocabulary from "../hooks/useInsertOrUpdateVocabulary";
import {
  AddVocabularyScreenProps,
  EditorInputValuesType,
} from "../types/TypeScriptTypes";

export default function AddVocabularyScreen({
  selectedDeck = null,
}: AddVocabularyScreenProps) {
  const {
    data: deckList,
    error: deckListError,
    isLoading: deckListIsLoading,
  } = useGetDecksQuery();
  const { id } = useParams();
  const navigate = useNavigate();

  const [currentDeck, setCurrentDeck] = useState({ deckId: "0", deckName: "" });
  const [editorsList, setEditorsList] = useState<Editor[]>([]);
  const [activeEditor, setActiveEditor] = useState<Editor | null>(null);
  const [hiddenInputs, setHiddenInputs] = useState<number[]>([]);

  const handleVocabularyButton = useInsertOrUpdateVocabulary(
    editorsList,
    selectedDeck,
    currentDeck.deckId,
    deckList,
    setEditorsList,
  );

  const editorInputValues: EditorInputValuesType = {
    0: selectedDeck?.front_word_html?.toString() ?? "",
    1: selectedDeck?.back_word_html?.toString() ?? "",
    2: selectedDeck?.audio_name?.toString() ?? "",
    3: selectedDeck?.front_desc_html?.toString() ?? "",
    4: selectedDeck?.back_desc_html?.toString() ?? "",
  };

  const handleEditorUpdate = useCallback(
    (editor: Editor) => {
      console.log(Editor)
      if (editorsList.length >= 5) return; // to prevent infinity loop
      setEditorsList((prev) => [...prev, editor]);
    },
    [editorsList],
  );

  if (deckListError) {
    console.error(deckListError);
    return <div>Error loading deck list</div>;
  }
  if (deckListIsLoading) return <div>Loading...</div>;
  if (!deckList || deckList.length === 0) {
    return <NoDeckScreen navigate={navigate} />;
  }

  return (
    <main className="flex h-[calc(100vh-3rem)] flex-col items-center justify-center overflow-auto bg-[#1F1F1F] pt-10">
      <div className="w-8/12">
        <DeckSelectionContainer
          deckList={deckList}
          selectedDeck={selectedDeck}
          id={id}
          currentDeck={currentDeck}
          setCurrentDeck={setCurrentDeck}
        />
      </div>
      <VocabularyEditor
        hiddenInputs={hiddenInputs}
        setHiddenInputs={setHiddenInputs}
        inputNames={[
          "Front word",
          "Back word",
          "Audio",
          "Front word description",
          "Back word description",
        ]}
        editorInputValues={editorInputValues}
        setActiveEditor={setActiveEditor}
        handleEditorUpdate={handleEditorUpdate}
        editorsList={editorsList}
        activeEditor={activeEditor}
      />
      <button
        className="m-4 rounded-xl bg-[#382bf0] p-2 font-extrabold hover:bg-[#5e43f3]"
        onClick={handleVocabularyButton}
      >
        {selectedDeck ? "Update vocabulary" : "Post vocabulary"}
      </button>
    </main>
  );
}
