import { Editor } from "@tiptap/core";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useGetDecksQuery } from "../API/Redux/reduxQueryFetch";
import DeckSelectionContainer from "../components/DeckSelection/DeckSelectionContainer";
import InspectScreen from "../features/AddVocabularyScreen/components/InspectScreen";
import NoDeckScreen from "../features/AddVocabularyScreen/components/NoDeckScreen";
import VocabularyEditor from "../features/AddVocabularyScreen/components/VocabularyEditor";
import useInsertOrUpdateVocabulary from "../hooks/useInsertOrUpdateVocabulary";
import {
  AddVocabularyScreenProps,
  EditorInputValuesType,
} from "../types/TypeScriptTypes";

export default function AddVocabularyScreen({
  selectedVocabulary = null,
}: AddVocabularyScreenProps) {
  const {
    data: deckList,
    error: deckListError,
    isLoading: deckListIsLoading,
  } = useGetDecksQuery({});
  const { id } = useParams();
  const navigate = useNavigate();

  const [currentDeck, setCurrentDeck] = useState({ deckId: "0", deckName: "" });
  const [editorsList, setEditorsList] = useState<Editor[]>([]);
  const [activeEditor, setActiveEditor] = useState<Editor | null>(null);
  const [hiddenInputs, setHiddenInputs] = useState<number[]>([]);
  const [isInspected, setIsInspected] = useState(false);

  // Reset editorsList when selectedVocabulary changes
  useEffect(() => {
    setEditorsList([]);
    setActiveEditor(null);
  }, [selectedVocabulary?.vocabulary_id]);

  const handleVocabularyButton = useInsertOrUpdateVocabulary(
    editorsList,
    selectedVocabulary,
    currentDeck.deckId,
    deckList,
    setEditorsList,
  );

  const editorInputValues: EditorInputValuesType = {
    0: selectedVocabulary?.front_word_html?.toString() ?? "",
    1: selectedVocabulary?.back_word_html?.toString() ?? "",
    2: selectedVocabulary?.audio_name?.toString() ?? "",
    3: selectedVocabulary?.front_desc_html?.toString() ?? "",
    4: selectedVocabulary?.back_desc_html?.toString() ?? "",
  };

  const handleEditorUpdate = useCallback(
    (editor: Editor) => {
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
    <main className="flex h-[calc(100vh-3rem)] w-full flex-col items-center overflow-auto bg-[#1F1F1F] pt-10">
      <div
        className={`${
          isInspected ? "hidden" : "block"
        } flex h-full w-11/12 flex-col justify-between`}
      >
        <div>
          <div>
            <DeckSelectionContainer
              deckList={deckList}
              selectedVocabulary={selectedVocabulary}
              id={id}
              currentDeck={currentDeck}
              setCurrentDeck={setCurrentDeck}
            />
          </div>
          <div>
            <VocabularyEditor
              key={selectedVocabulary?.vocabulary_id ?? "new"}
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
          </div>
        </div>
        <div>
          <div className="mb-10 mt-4 flex flex-row items-center justify-center gap-4">
            <button
              onClick={() => setIsInspected(true)}
              className="w-44 rounded-xl bg-blue-600 p-2 font-extrabold hover:opacity-60"
            >
              Preview
            </button>
            <button
              className="w-44 rounded-xl bg-green-600 p-2 font-extrabold hover:opacity-60"
              onClick={handleVocabularyButton}
            >
              {selectedVocabulary ? "Update vocabulary" : "Post vocabulary"}
            </button>
          </div>
        </div>
      </div>
      <div className={`${isInspected ? "block" : "hidden"} h-full w-full`}>
        <InspectScreen
          setIsInspected={setIsInspected}
          editorsList={editorsList}
        />
      </div>
    </main>
  );
}
