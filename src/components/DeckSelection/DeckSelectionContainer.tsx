import DeckSelection from "./DeckSelection";

export default function DeckSelectionContainer({
  deckList,
  selectedVocabulary,
  id,
  currentDeck,
  setCurrentDeck,
  isInitialDeck = true,
}: {
  deckList: any;
  selectedVocabulary: any;
  id: string | undefined;
  currentDeck: { deckId: string; deckName: string };
  setCurrentDeck: React.Dispatch<
    React.SetStateAction<{ deckId: string; deckName: string }>
  >;
  isInitialDeck?: boolean;
}) {
  return (
    <div className="w-full bg-black">
      {!selectedVocabulary && id === "0" ? (
        <DeckSelection
          deckList={deckList}
          currentDeck={currentDeck}
          setCurrentDeck={setCurrentDeck}
          isInitialDeck={isInitialDeck}
        />
      ) : null}
    </div>
  );
}
